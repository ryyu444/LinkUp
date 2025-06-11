"use client";

import { useEffect, useState, useContext } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getFirebaseDB } from "@/(api)/_lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { AuthContext } from "../_contexts/AuthContext";
import { joinSession } from "@/(api)/_lib/firebase/joinSession";
import ProtectedRoute from "../_components/protectedRoute/protectedRoute";
import InfoCard from "../_components/dashboard/infoCard/infoCard";
import ActivityCard from "../_components/dashboard/activityCard/activityCard";
import StatCard from "../_components/dashboard/statCard/statCard";
import SessionPopup from "../_components/session/sessionPopup/sessionPopup";
import SessionPreview from "../_components/session/sessionPreview/sessionPreview";
import SessionForm from "../_components/session/sessionForm/sessionForm";
import { Search, Plus, Folder } from "lucide-react";
import Session from "@/app/_types/session/Session";
import { addSession } from "@/(api)/_lib/firebase/addSession";

/*
  Set up auth to read in user specific information. (user object could contain name, stats, & registered sessions)
  Render the dashboard with user-specific data. (name, upcoming sessions, stats)
  Make the session previews clickable to view session details with the SessionPopup component.
*/
export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const joinSessionHandler = () => {
    if (!user || !selectedSession) return;

    joinSession(selectedSession.sessionID, user.uuid, () => {
      setShowSessionPopup(false);
      // setShowConfirmationModal(true);

      // remove session user just joined from list
      setSessions((prev) =>
        prev.filter((session) => session.sessionID != selectedSession.sessionID)
      );
    });
  };
  const fetchSessions = async () => {
    try {
      const db = getFirebaseDB();
      const q = query(
        collection(db, "sessions"),
        orderBy("startTime"),
        limit(3)
      );
      const snapshot = await getDocs(q);

      const sessionList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          sessionID: doc.id,
          host: data.host,
          title: data.title,
          description: data.description,
          day: data.day,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          location: data.location,
          noise: data.noise,
          capacity: data.capacity,
          registered: data.registered ?? [],
          tags: data.tags ?? [],
        };
      }) as Session[];

      setSessions(sessionList);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50 font-['Inter'] px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col justify-center py-10 space-y-10">
          {/* Header */}
          <div>
            <h1 className="text-sky-950 text-3xl font-bold leading-9">
              Dashboard
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal mt-1">
              Welcome back,{" "}
              {user?.displayName && user.displayName != ""
                ? user.displayName
                : "Guest"}
              ! Ready to study?
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Browse Sessions"
              description="Find study buddies for your upcoming exams and projects."
              ctaText="Find a session →"
              icon={Search}
              onClick={() => router.push("/browse")}
            />

            <InfoCard
              title="Create Session"
              description="Start a new study group and invite others to join."
              ctaText="Create now →"
              icon={Plus}
              onClick={() => setShowCreatePopup(true)}
            />

            <InfoCard
              title="My Sessions"
              description="View and manage your study sessions."
              ctaText="View all →"
              icon={Folder}
              onClick={() => router.push("/sessions")}
            />
          </div>

          {/* Upcoming Sessions */}
          <div className="flex justify-between items-center mt-8">
            <h2 className="text-sky-950 text-2xl font-bold leading-loose">
              Upcoming Sessions
            </h2>
            <button
              onClick={() => router.push("/browse")}
              className="text-blue-600 text-base font-normal cursor-pointer hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                return (
                  <div
                    key={session.sessionID}
                    onClick={() => {
                      setSelectedSession(session);
                      setShowSessionPopup(true);
                    }}
                    className="cursor-pointer"
                  >
                    <SessionPreview session={session} />
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm font-normal">
                No more upcoming sessions. Check back later or create your own!
              </p>
            )}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <ActivityCard />
            <StatCard />
          </div>
        </div>
      </div>

      {(() => {
        if (showSessionPopup && selectedSession) {
          return (
            <SessionPopup
              session={selectedSession}
              onClose={() => setShowSessionPopup(false)}
              onJoin={joinSessionHandler}
            />
          );
        }

        return null;
      })()}

      {(() => {
        if (showCreatePopup) {
          return (
            <div
              className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex justify-center items-center p-4"
              onClick={() => setShowCreatePopup(false)}
            >
              <div
                className="relative bg-white rounded-xl max-w-4xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowCreatePopup(false)}
                  className="absolute top-4 right-7 text-gray-400 hover:text-gray-600 text-3xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <SessionForm
                  isEditing={false}
                  onSubmit={async (session) => {
                    try {
                      // Add the current user as host
                      const sessionToAdd = {
                        ...session,
                        host: {
                          uuid: user?.uuid ?? "",
                          displayName: user?.displayName ?? "Anonymous",
                          profilePicture: user?.profilePicture ?? '',
                        },
                        registered: [], // start empty
                        tags: [], // can add tag support later
                      };

                      const newSessionID = await addSession(sessionToAdd);

                      console.log("Session created with ID:", newSessionID);

                      // Refresh the sessions list if you want
                      await fetchSessions(); // if you extract this to a reusable function

                      // Close the form
                      setShowCreatePopup(false);
                    } catch (error) {
                      console.error("Error creating session:", error);
                    }
                  }}
                  onDelete={() => {}}
                />
              </div>
            </div>
          );
        }
        return null;
      })()}
    </ProtectedRoute>
  );
}

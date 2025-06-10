"use client";

import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
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

import { Search, Plus, Folder } from "lucide-react";
import Session from "@/app/_types/session/Session";

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
  const [hostUser, setHostUser] = useState<{
    displayName: string;
    avatarUrl: string;
  } | null>(null);
  const joinSessionHandler = () => {
    if (!user || !selectedSession) return;

    joinSession(selectedSession.sessionID, user.uuid, () => {
      setShowSessionPopup(false);
      // setShowConfirmationModal(true);
    });
  };
  useEffect(() => {
    if (!user?.uuid) return;

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

    fetchSessions();
  }, [user]);

  useEffect(() => {
    const fetchHostUser = async () => {
      if (!selectedSession || !selectedSession.host) {
        setHostUser(null);
        return;
      }

      try {
        const db = getFirebaseDB();
        const userRef = doc(db, "users", selectedSession.host);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setHostUser({
            displayName: data.displayName,
            avatarUrl: data.avatarUrl ?? "https://placehold.co/46x46",
          });
        } else {
          setHostUser({
            displayName: "Unknown",
            avatarUrl: "https://placehold.co/46x46",
          });
        }
      } catch (error) {
        console.error("Error fetching host user:", error);
        setHostUser({
          displayName: "Error",
          avatarUrl: "https://placehold.co/46x46",
        });
      }
    };

    fetchHostUser();
  }, [selectedSession]);

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
              Welcome back, {user?.displayName ?? "Guest"}! Ready to study?
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
              onClick={() => router.push('/browse')}
              className='text-blue-600 text-base font-normal cursor-pointer hover:underline'
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {sessions.map((session) => {
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
            })}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <ActivityCard />
            <StatCard />
          </div>
        </div>
      </div>

      {(() => {
        if (showSessionPopup && selectedSession && hostUser) {
          return (
            <SessionPopup
              session={selectedSession}
              hostUser={hostUser}
              onClose={() => setShowSessionPopup(false)}
              onJoin={joinSessionHandler}
            />
          );
        }

        return null;
      })()}
    </ProtectedRoute>
  );
}

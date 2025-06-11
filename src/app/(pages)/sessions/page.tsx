'use client';

import { useEffect, useState, useContext } from 'react';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { AuthContext } from '../_contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import { leaveSession } from '@/(api)/_lib/firebase/sessions/leaveSession';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';
import SessionPopup from '../_components/session/sessionPopup/sessionPopup';
import Session from '@/app/_types/session/Session';
import SessionForm from '../_components/session/sessionForm/sessionForm';

/*
    Corresponds to My Sessions in figma
    1. Get the sessions from props
    2. Separate the sessions that are upcoming vs. past + filter out full sessions
    3. Pass the split data into sessionPreview components
    4. Style properly
*/
export default function Sessions() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const fetchSessions = async () => {
    if (!user?.uuid) return;

    const db = getFirebaseDB();
    const sessionsQuery = query(
      collection(db, 'sessions'),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs(sessionsQuery);
    const fetchedSessions: Session[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedSessions.push({
        host: data.host,
        sessionID: doc.id,
        title: data.title,
        description: data.description,
        day: data.day,
        startTime: (data.startTime as Timestamp).toDate(),
        endTime: (data.endTime as Timestamp).toDate(),
        location: data.location,
        noise: data.noise,
        capacity: data.capacity,
        registered: data.registered ?? [],
        tags: data.tags ?? [],
      });
    });

    const mySessions = fetchedSessions.filter((session) => {
      const isHost = session.host.uuid === user?.uuid;
      const isRegistered = session.registered.includes(user?.uuid || '');
      return isHost || isRegistered;
    });

    setSessions(mySessions);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [user?.uuid]);

  // Split upcoming vs past sessions
  const now = new Date();
  const upcomingSessions = sessions.filter(
    (session) =>
      session.startTime >= now && session.registered.length < session.capacity
  );

  const pastSessions = sessions.filter((session) => session.endTime < now);

  const leaveSessionHandler = async () => {
    if (!user || !selectedSession) return;

    await leaveSession(selectedSession.sessionID, user?.uuid, () => {
      setShowSessionPopup(false);
      setSessions((prev) =>
        prev.filter(
          (session) => session.sessionID !== selectedSession.sessionID
        )
      );
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className='text-center mt-20 text-gray-600'>
          Loading sessions...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='w-full min-h-screen bg-stone-50 px-[62px] py-[65px]'>
        {/* Page header */}
        <h1 className='text-sky-950 text-3xl font-bold leading-9 mb-2'>
          My Sessions
        </h1>
        <p className='text-gray-600 text-base leading-normal mb-10'>
          View, edit, or delete your sessions
        </p>

        {/* Upcoming Sessions */}
        <h2 className='text-sky-950 text-2xl font-bold leading-loose mb-4'>
          Upcoming Sessions
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className='flex flex-col gap-6 mb-12'>
            {upcomingSessions.map((session) => (
              <div
                className='cursor-pointer'
                key={`upcoming ${session.sessionID}`}
                onClick={() => {
                  setSelectedSession(session);
                  setShowSessionPopup(true);
                }}
              >
                <SessionPreview
                  key={session.sessionID}
                  session={session}
                  isHost={session.host.uuid === user?.uuid}
                  onEdit={(session) => setEditSession(session)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500 text-sm mb-12'>
            No upcoming sessions.
          </div>
        )}

        {/* Past Sessions */}
        <h2 className='text-sky-950 text-2xl font-bold leading-loose mb-4'>
          Past Sessions
        </h2>
        {pastSessions.length > 0 ? (
          <div className='flex flex-col gap-6 mb-12'>
            {pastSessions.map((session) => (
              <div
                className='cursor-pointer'
                key={`past ${session.sessionID}`}
                onClick={() => {
                  setSelectedSession(session);
                  setShowSessionPopup(true);
                }}
              >
                <SessionPreview
                  key={session.sessionID}
                  session={session}
                  isHost={session.host.uuid === user?.uuid}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500 text-sm'>No past sessions.</div>
        )}
      </div>

      {showSessionPopup && selectedSession && (
        <SessionPopup
          session={selectedSession}
          onClose={() => setShowSessionPopup(false)}
          onLeave={leaveSessionHandler}
        />
      )}

      {editSession && (
        <div
          className='fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex justify-center items-center p-4'
          onClick={() => setEditSession(null)}
        >
          <div
            className='relative bg-white rounded-xl max-w-4xl w-full p-8'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditSession(null)}
              className='absolute top-4 right-7 text-gray-400 hover:text-gray-600 text-3xl font-bold'
              aria-label='Close'
            >
              &times;
            </button>
            <SessionForm
              isEditing={true}
              initialValues={editSession} // 🚩 pass session to edit
              onSubmit={async (updatedFields) => {
                // Save updated session to Firebase here:
                const db = getFirebaseDB();
                const sessionRef = doc(db, 'sessions', editSession.sessionID);

                await updateDoc(sessionRef, {
                  title: updatedFields.title,
                  description: updatedFields.description,
                  location: updatedFields.location,
                  day: updatedFields.day,
                  startTime: updatedFields.startTime,
                  endTime: updatedFields.endTime,
                  noise: updatedFields.noise,
                  capacity: updatedFields.capacity,
                });

                // Refresh session list
                await fetchSessions();

                // Close the edit form
                setEditSession(null);
              }}
              onDelete={async () => {
                // Handle delete
                const db = getFirebaseDB();
                const sessionRef = doc(db, 'sessions', editSession.sessionID);

                await deleteDoc(sessionRef);

                // Refresh session list
                await fetchSessions();

                // Close the edit form
                setEditSession(null);
              }}
              onCancel={() => setEditSession(null)}
            />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

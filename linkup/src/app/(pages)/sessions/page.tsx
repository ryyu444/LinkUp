'use client';

import { useEffect, useState, useContext } from 'react';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { AuthContext } from '../_contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';
import SessionPopup from '../_components/session/sessionPopup/sessionPopup';
import Session from '@/app/_types/session/Session';

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

  useEffect(() => {
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

    fetchSessions();
  }, [user?.uuid]);

  // Split upcoming vs past sessions
  const now = new Date();
  const upcomingSessions = sessions.filter(
    (session) =>
      session.startTime >= now && session.registered.length < session.capacity
  );

  const pastSessions = sessions.filter((session) => session.endTime < now);

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
                <SessionPreview key={session.sessionID} session={session} />
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
                <SessionPreview key={session.sessionID} session={session} />
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
          onJoin={() => {}}
        />
      )}
    </ProtectedRoute>
  );
}

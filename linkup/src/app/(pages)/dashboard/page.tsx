'use client';

import { useEffect, useState, useContext } from 'react';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../_contexts/AuthContext';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import InfoCard from '../_components/dashboard/infoCard/infoCard';
import ActivityCard from '../_components/dashboard/activityCard/activityCard';
import StatCard from '../_components/dashboard/statCard/statCard';
import SessionPopup from "../_components/session/sessionPopup/sessionPopup";
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';

import { Search, Plus, Folder } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  location: string;
  time: string;
  date: Timestamp;
  createdBy: string;
  [key: string]: any;
}

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
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const db = getFirebaseDB();
        const q = query(collection(db, 'sessions'), orderBy('date'), limit(3));
        const snapshot = await getDocs(q);
        const sessionList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Session[];
        setSessions(sessionList);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
  
    fetchSessions();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50 font-['Inter'] px-4 sm:px-8 lg:px-16">
        <div className='flex flex-col justify-center py-10 space-y-10'>
          {/* Header */}
          <div>
            <h1 className='text-sky-950 text-3xl font-bold leading-9'>
              Dashboard
            </h1>
            <p className='text-gray-600 text-base font-normal leading-normal mt-1'>
              Welcome back, Jane! Ready to study?
              {/* Welcome back, {auth?.user?.name ?? 'Guest'}! Ready to study? */}
            </p>
          </div>

          {/* Info Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <InfoCard
              title='Browse Sessions'
              description='Find study buddies for your upcoming exams and projects.'
              ctaText='Find a session →'
              icon={Search}
              onClick={() => router.push('/browse')}
            />

            <InfoCard
              title='Create Session'
              description='Start a new study group and invite others to join.'
              ctaText='Create now →'
              icon={Plus}
              onClick={() => setShowCreatePopup(true)}
            />

            <InfoCard
              title='My Sessions'
              description='View and manage your study sessions.'
              ctaText='View all →'
              icon={Folder}
              onClick={() => router.push('/sessions')}
            />
          </div>

          {/* Upcoming Sessions */}
          <div className='flex justify-between items-center mt-8'>
            <h2 className='text-sky-950 text-2xl font-bold leading-loose'>
              Upcoming Sessions
            </h2>
            <button
              onClick={() => router.push('/browse')}
              className='text-blue-600 text-base font-normal hover:underline'
            >
              View all
            </button>
          </div>
          <div className='space-y-4'>
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSession(session);
                  setShowSessionPopup(true);
                }}
                className="cursor-pointer"
              >
                <SessionPreview session={session} />
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10'>
            <ActivityCard />
            <StatCard />
          </div>

          {/* {showCreatePopup && (
          <SessionPopup
            mode="create"
            onClose={() => setShowCreatePopup(false)}
            onSuccess={() => {
              setShowCreatePopup(false);
              // Optionally refresh data
            }}
          />
        )} */}
        </div>
      </div>
      {showSessionPopup && selectedSession && (
        <SessionPopup
          session={selectedSession}
          onClose={() => setShowSessionPopup(false)}
        />
      )}
    </ProtectedRoute>
  );
}

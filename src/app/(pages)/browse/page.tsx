'use client';

import { useEffect, useState, useContext } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { joinSession } from '@/(api)/_lib/firebase/sessions/joinSession';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { AuthContext } from '../_contexts/AuthContext';
import SessionCard from '../_components/session/sessionCard/sessionCard';
import Session from '../../_types/session/Session';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import SessionPopup from '../_components/session/sessionPopup/sessionPopup';
import ConfirmationModal from '../_components/confirmationModal/confirmationModal';

/*
    Corresponds to Browse figma page
    1. Get session data from props
    2. Filter out full sessions and ones made by you
    3. Create state for the filters
    4. Create filter inputs
    5. Create available session displays that updates when filters are applied
*/
export default function Browse() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [noiseFilter, setNoiseFilter] = useState('');
  const [groupSizeFilter, setGroupSizeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const noiseMap = ['Silent', 'Low', 'Medium', 'Collaborative']; // 0 → 3
  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setShowSessionPopup(true);
  };

  const handleJoinSession = async () => {
    if (!selectedSession || !user) return;

    await joinSession(selectedSession.sessionID, user.uuid, () => {
      console.log('Join successful!');
      setShowSessionPopup(false);
      setConfirmationModal(true);
      // Remove the session from the list after joining
      setSessions((prev) =>
        prev.filter(
          (session) => session.sessionID !== selectedSession.sessionID
        )
      );
    });
  };

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const db = getFirebaseDB();
        const q = query(collection(db, 'sessions'), orderBy('startTime'));
        const snapshot = await getDocs(q);

        const sessionList = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            sessionID: doc.id,
            ...data,
            startTime: data.startTime.toDate(), // Convert Timestamp → Date
            endTime: data.endTime.toDate(), // Convert Timestamp → Date
          };
        }) as Session[];

        const now = new Date();
        const filteredSessions = sessionList.filter((session) => {
          return (
            session.startTime > now &&
            session.host.uuid !== user?.uuid &&
            !session.registered.includes(user?.uuid || '') &&
            session.registered.length < session.capacity
          );
        });

        setSessions(filteredSessions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, [user, isLoading]);

  // Filters
  const filteredSessions = sessions.filter((session) => {
    const matchesSubject =
      subjectFilter === '' ||
      session.title.toLowerCase().includes(subjectFilter.toLowerCase());

    const matchesLocation =
      locationFilter === '' ||
      session.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesNoise =
      noiseFilter === '' ||
      (noiseMap[session.noise] ?? 'Unknown')
        .toLowerCase()
        .includes(noiseFilter.toLowerCase());

    const matchesGroupSize =
      groupSizeFilter === '' ||
      `${session.registered.length}/${session.capacity}`.includes(
        groupSizeFilter
      );

    const matchesDate = dateFilter === '' || session.day.includes(dateFilter);

    const matchesTime =
      timeFilter === '' ||
      session.startTime
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        .includes(timeFilter);

    return (
      matchesSubject &&
      matchesLocation &&
      matchesNoise &&
      matchesGroupSize &&
      matchesDate &&
      matchesTime
    );
  });

  // Sorting
  const sortedFilteredSessions = [...filteredSessions].sort((a, b) => {
    if (sortOption === 'date-asc') {
      return new Date(a.day).getTime() - new Date(b.day).getTime();
    } else if (sortOption === 'date-desc') {
      return new Date(b.day).getTime() - new Date(a.day).getTime();
    } else if (sortOption === 'members-asc') {
      return a.registered.length - b.registered.length;
    } else if (sortOption === 'members-desc') {
      return b.registered.length - a.registered.length;
    } else {
      return 0;
    }
  });

  const handleClearFilters = () => {
    setSubjectFilter('');
    setLocationFilter('');
    setNoiseFilter('');
    setGroupSizeFilter('');
    setDateFilter('');
    setTimeFilter('');
    setSortOption('date-asc');
  };

  return (
    <ProtectedRoute>
      <div className='px-6 py-6 bg-stone-50 min-h-screen flex justify-center'>
        <div className='w-full max-w-7xl'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-sky-950 text-3xl font-bold mb-2'>
                Browse Study Sessions
              </h1>
              <p className='text-gray-600 text-sm'>
                Find and join study sessions with other students
              </p>
            </div>
            <div
              className='text-blue-600 text-base cursor-pointer'
              onClick={handleClearFilters}
            >
              Clear all
            </div>
          </div>

          {/* Filters */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>
                Subject
              </label>
              <input
                type='text'
                placeholder='All Subjects'
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md  outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>
                Location
              </label>
              <input
                type='text'
                placeholder='All Locations'
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>
                Noise Level
              </label>
              <input
                type='text'
                placeholder='Any Noise Level'
                value={noiseFilter}
                onChange={(e) => setNoiseFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>
                Group Size
              </label>
              <input
                type='text'
                placeholder='Any Size'
                value={groupSizeFilter}
                onChange={(e) => setGroupSizeFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>Date</label>
              <input
                type='text'
                placeholder='mm/dd/yyyy'
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>Time</label>
              <input
                type='text'
                placeholder='Any Time'
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md  outline-1 outline-gray-300 px-3'
              />
            </div>
          </div>

          {/* Available Sessions */}
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sky-950 text-xl font-bold'>
              Available Sessions ({sessions.length})
            </h2>
            <div className='flex items-center gap-2'>
              <span className='text-gray-600 text-sm'>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className='rounded border border-slate-500 px-2 py-1 text-black text-sm'
              >
                <option value='date-asc'>Date (Soonest → Latest)</option>
                <option value='date-desc'>Date (Latest → Soonest)</option>
                <option value='members-asc'>Group Size (Small → Large)</option>
                <option value='members-desc'>Group Size (Large → Small)</option>
              </select>
            </div>
          </div>

          {/* Sessions Grid */}
          <div
            className='
              grid 
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
              gap-6 mb-12
            '
          >
            {isLoading ? (
              <p>Loading sessions...</p>
            ) : sortedFilteredSessions.length === 0 ? (
              <p className='text-gray-500 text-sm font-normal'>
                No sessions found. Try adjusting your filters, checking back
                later, or creating your own!
              </p>
            ) : (
              sortedFilteredSessions.map((session) => (
                <SessionCard
                  key={session.sessionID}
                  title={session.title}
                  location={session.location}
                  date={session.day}
                  time={session.startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  members={`${session.registered.length}/${session.capacity}`}
                  noise={noiseMap[session.noise] ?? 'Unknown'}
                  tags={session.tags?.map((tag) => tag.title) ?? []}
                  onView={() => handleViewSession(session)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {showSessionPopup && selectedSession && (
        <SessionPopup
          session={selectedSession}
          onClose={() => {
            setShowSessionPopup(false);
          }}
          onJoin={handleJoinSession} // pass in the handleJoinSession here
        />
      )}

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal}
          handler={() => setConfirmationModal(false)}
          sessionTitle={selectedSession?.title || ''}
          action='registered'
        />
      )}
    </ProtectedRoute>
  );
}

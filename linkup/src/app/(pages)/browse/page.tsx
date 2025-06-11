'use client';

import { useEffect, useState, useContext } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { AuthContext } from '../_contexts/AuthContext';
import SessionCard from '../_components/session/sessionCard/sessionCard';
import Session from '../../_types/session/Session';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
/*
    Corresponds to Browse figma page
    1. Get session data from props
    2. Filter out full sessions and ones made by you
    3. Create state for the filters
    4. Create filter inputs
    5. Create available session displays that updates when filters are applied
*/

// add state for filters
// ignore pagination since its not that easy.


// note: filtering is not working right now bc we need to update the sessions in the db to have the correct fields
export default function Browse() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [noiseFilter, setNoiseFilter] = useState('');
  const [groupSizeFilter, setGroupSizeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const db = getFirebaseDB();
        const q = query(collection(db, 'sessions'), orderBy('date'));
        const snapshot = await getDocs(q);
        const sessionList = snapshot.docs.map((doc) => ({
          sessionID: doc.id,
          ...doc.data(),
        })) as Session[];

        // Apply filtering
        const filteredSessions = sessionList.filter((session) => {
          const isFull =
            (session.registered?.length ?? 0) >= (session.capacity ?? Infinity);
          const isCreatedByMe = session.host.uuid === user?.uuid;
          return !isFull && !isCreatedByMe;
        });

        setSessions(filteredSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  // need to fix filters to work with Session type
  const filteredSessions = sessions.filter((session) => {
    const matchesSubject =
      subjectFilter === '' ||
      session.title.toLowerCase().includes(subjectFilter.toLowerCase());

    const matchesLocation =
      locationFilter === '' ||
      session.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesNoise =
      noiseFilter === '' ||
      (session.noise ?? 'unknown')
        .toLowerCase()
        .includes(noiseFilter.toLowerCase());

    const matchesGroupSize =
      groupSizeFilter === '' ||
      `${session.registered?.length ?? 0}/${session.capacity ?? '-'}`.includes(
        groupSizeFilter
      );

    const matchesDate =
      dateFilter === '' ||
      session.day.toDate().toLocaleDateString().includes(dateFilter);

    const matchesTime =
      timeFilter === '' ||
      session.startTime.toLowerCase().includes(timeFilter.toLowerCase());

    return (
      matchesSubject &&
      matchesLocation &&
      matchesNoise &&
      matchesGroupSize &&
      matchesDate &&
      matchesTime
    );
  });

  const sortedFilteredSessions = [...filteredSessions].sort((a, b) => {
    if (sortOption === 'date-asc') {
      return a.date.toMillis() - b.date.toMillis();
    } else if (sortOption === 'date-desc') {
      return b.date.toMillis() - a.date.toMillis();
    } else if (sortOption === 'members-asc') {
      const aMembers = a.attendees?.length ?? 0;
      const bMembers = b.attendees?.length ?? 0;
      return aMembers - bMembers;
    } else if (sortOption === 'members-desc') {
      const aMembers = a.attendees?.length ?? 0;
      const bMembers = b.attendees?.length ?? 0;
      return bMembers - aMembers;
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
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
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
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
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
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
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
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>Date</label>
              <input
                type='text'
                placeholder='mm/dd/yyyy'
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
              />
            </div>
            <div>
              <label className='block text-gray-700 text-sm mb-1'>Time</label>
              <input
                type='text'
                placeholder='Any Time'
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className='w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3'
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
            {loading ? (
              <p>Loading sessions...</p>
            ) : (
              sortedFilteredSessions
                .slice(0, 6)
                .map((session) => (
                  <SessionCard
                    key={session.id}
                    title={session.title}
                    location={session.location}
                    date={session.date.toDate().toDateString()}
                    time={session.time}
                    members={`${session.attendees?.length ?? 0}/${
                      session.maxSize ?? '-'
                    }`}
                    noise={session.noise ?? 'Unknown'}
                    tags={session.tags ?? []}
                  />
                ))
            )}
          </div>

          {/* Pagination */}
          {/* <div className='flex justify-center gap-2'>
            <button className='w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 flex items-center justify-center text-gray-700'>
              &lt;
            </button>
            <button className='w-9 h-10 bg-blue-600 rounded-md outline outline-1 outline-blue-600 text-white'>
              2
            </button>
            <button className='w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 text-gray-700'>
              3
            </button>
            <span className='w-6 h-10 flex items-center justify-center text-gray-500 text-base'>
              ...
            </span>
            <button className='w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 text-gray-700'>
              8
            </button>
            <button className='w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 flex items-center justify-center text-gray-700'>
              &gt;
            </button>
          </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
}

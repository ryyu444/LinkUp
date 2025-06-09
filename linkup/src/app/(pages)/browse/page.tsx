"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFirebaseDB } from "@/(api)/_lib/firebase/firebaseClient";
import ProtectedRoute from "../_components/protectedRoute/protectedRoute";
import SessionCard from "../_components/session/sessionCard/sessionCard";
import { Timestamp } from "firebase/firestore";

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

interface Session {
  id: string;
  title: string;
  location: string;
  time: string;
  date: Timestamp;
  createdBy: string;
  attendees?: string[];
  noise?: string;
  tags?: string[];
  maxSize?: number;
}

export default function Browse() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const db = getFirebaseDB();
        const q = query(collection(db, "sessions"), orderBy("date"));
        const snapshot = await getDocs(q);
        const sessionList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Session[];
        setSessions(sessionList);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <ProtectedRoute>
      <div className="px-8 py-6 bg-stone-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-sky-950 text-3xl font-bold mb-2">
              Browse Study Sessions
            </h1>
            <p className="text-gray-600 text-sm">
              Find and join study sessions with other students
            </p>
          </div>
          <div className="text-blue-600 text-base cursor-pointer">
            Clear all
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Subject</label>
            <input
              type="text"
              placeholder="All Subjects"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Location</label>
            <input
              type="text"
              placeholder="All Locations"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Noise Level
            </label>
            <input
              type="text"
              placeholder="Any Noise Level"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Group Size
            </label>
            <input
              type="text"
              placeholder="Any Size"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Date</label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Time</label>
            <input
              type="text"
              placeholder="Any Time"
              className="w-full h-11 bg-white rounded-md outline outline-1 outline-gray-300 px-3"
            />
          </div>
        </div>

        {/* Available Sessions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sky-950 text-xl font-bold">
            Available Sessions ({sessions.length})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <select className="rounded border border-slate-500 px-2 py-1 text-black text-sm">
              <option>Date (Soonest)</option>
            </select>
          </div>
        </div>

        <div
          className="
            grid 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
            gap-6 mb-12
          "
          style={{ height: "calc(100vh - 400px)" }}
        >
          {loading ? (
            <p>Loading sessions...</p>
          ) : (
            sessions.slice(0, 6).map((session) => (
              <SessionCard
                key={session.id}
                title={session.title}
                location={session.location}
                date={session.date.toDate().toDateString()} // converts Timestamp → readable string
                time={session.time} // already a string
                members={`${session.attendees?.length ?? 0}/${session.maxSize ?? '-'}`}
                noise={session.noise ?? 'Unknown'}
                tags={session.tags ?? []}
              />
            ))
            
          )}
        </div>

        {/* Pagination — you can customize this */}
        <div className="flex justify-center gap-2">
          <button className="w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 flex items-center justify-center text-gray-700">
            &lt;
          </button>
          <button className="w-9 h-10 bg-blue-600 rounded-md outline outline-1 outline-blue-600 text-white">
            2
          </button>
          <button className="w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 text-gray-700">
            3
          </button>
          <span className="w-6 h-10 flex items-center justify-center text-gray-500 text-base">
            ...
          </span>
          <button className="w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 text-gray-700">
            8
          </button>
          <button className="w-9 h-10 bg-white rounded-md outline outline-1 outline-gray-300 flex items-center justify-center text-gray-700">
            &gt;
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

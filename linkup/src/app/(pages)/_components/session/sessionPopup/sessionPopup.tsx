'use client';

import React from 'react';
import { Timestamp } from 'firebase/firestore';

interface Session {
  id: string;
  title: string;
  location: string;
  time: string;
  date: Timestamp;
  createdBy: string;
  attendees?: string[];
}

interface SessionPopupProps {
  session: Session;
  onClose: () => void;
}

export default function SessionPopup({ session, onClose }: SessionPopupProps) {
  const { title, location, time, date, createdBy, attendees = [] } = session;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5"
    onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative font-['Inter']"
      onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Session Details */}
        <h2 className="text-sky-950 text-2xl font-bold mb-4">{title}</h2>

        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {date.toDate().toDateString()}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Time:</strong> {time}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Created by:</strong> {createdBy}
        </p>

        <div className="text-gray-700 mb-2">
          <strong>Attendees:</strong>
          <ul className="list-disc list-inside mt-1">
            {attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <li key={index}>{attendee}</li>
              ))
            ) : (
              <li>No attendees yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React, { useContext } from 'react';
import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
import Session from '@/app/_types/session/Session';
import Link from 'next/link';

interface SessionPopupProps {
  session: Session;
  onClose: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
}

export default function SessionPopup({
  session,
  onClose,
  onJoin,
  onLeave,
}: SessionPopupProps) {
  const {
    title,
    description,
    day,
    startTime,
    endTime,
    location,
    noise,
    capacity,
    registered,
  } = session;

  const { user } = useContext(AuthContext);

  const hostUser = {
    displayName: session.host.displayName || 'Unknown',
    avatarUrl:
      session.host.profilePicture || 'https://placehold.co/50x50?text=U',
    uuid: session.host.uuid,
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-5'
      onClick={onClose}
    >
      <div
        className='w-[750px] h-[750px] bg-white rounded-[20px] outline-[3px] outline-offset-[-3px] outline-gray-200 overflow-hidden relative flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className='absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10'
          onClick={onClose}
        >
          &times;
        </button>

        {/* Main scrollable content */}
        <div className='flex-1 overflow-y-auto px-8 pt-8 pb-32'>
          {/* Title */}
          <h2 className="text-sky-950 text-4xl font-bold font-['Inter'] leading-normal text-center mb-6">
            {title}
          </h2>

          {/* Description */}
          <div className="text-black text-2xl font-semibold font-['Inter'] mb-2">
            Session Description
          </div>
          <p className="text-black text-sm font-normal font-['Inter'] leading-normal mb-6 whitespace-pre-line">
            {description}
          </p>

          {/* Details */}
          <div className="flex flex-col gap-2 text-gray-600 text-sm font-['Inter'] mb-8">
            <div className='flex items-center gap-2'>
              <span>📍</span>
              <span>{location}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>📅</span>
              <span>{day}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>🕒</span>
              <span>
                {startTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span>👥</span>
              <span>
                {registered.length}/{capacity} Members
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span>🔈</span>
              <span>
                {noise === 0
                  ? 'Silent'
                  : noise === 1
                  ? 'Quiet'
                  : noise === 2
                  ? 'Moderate'
                  : 'Collaborative'}
              </span>
            </div>
          </div>
        </div>

        {/* Fixed bottom section */}
        <div className='absolute bottom-8 left-8 right-8 flex flex-col gap-4'>
          {/* Host */}
          <div className='flex items-center gap-4'>
            <Link href={`/user/${hostUser.uuid}`}>
              <img
                src={hostUser?.avatarUrl}
                alt='Host avatar'
                className='w-11 h-11 rounded-full'
              />
            </Link>
            <div>
              <div className="text-gray-600 text-sm font-['Inter']">Host</div>
              <div className="text-gray-600 text-2xl font-['Inter']">
                {hostUser?.displayName}
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className='flex flex-wrap items-center gap-2'>
            {registered.length > 0 ? (
              registered.map((uuid, index) => (
                <img
                  key={index}
                  src={`https://placehold.co/28x28?text=${uuid.charAt(0)}`}
                  alt={uuid}
                  className='w-7 h-7 rounded-full border border-white'
                />
              ))
            ) : (
              <div className="text-gray-500 text-sm font-['Inter']">
                No attendees yet
              </div>
            )}
          </div>

          {/* Join Button */}
          {Date.now() < startTime.getTime() &&
            registered.length < capacity &&
            !registered.includes(user?.uuid || '') &&
            hostUser.uuid !== user?.uuid && (
              <div className='flex justify-end mt-2'>
                <button
                  className="w-16 h-10 bg-blue-600 text-white text-base font-['Inter'] rounded-md hover:bg-blue-700 cursor-pointer"
                  onClick={onJoin}
                >
                  Join
                </button>
              </div>
            )}

          {/* Leave Button */}
          {Date.now() < startTime.getTime() &&
            registered.includes(user?.uuid || '') &&
            hostUser.uuid !== user?.uuid && (
              <div className='flex justify-end mt-2'>
                <button
                  className="w-16 h-10 bg-red-600 text-white text-base font-['Inter'] rounded-md hover:bg-red-700 cursor-pointer"
                  onClick={onLeave}
                >
                  Leave
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

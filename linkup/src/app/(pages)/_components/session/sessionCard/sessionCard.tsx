// Card for Sessions in Browse
'use client';

import { CiLocationOn, CiClock1 } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';
import { IoVolumeHighOutline } from 'react-icons/io5';

/*
  Make sure the View button opens up a SessionPopup component with the session details
  Restyle the cards to match design in figma more closely
*/
export default function SessionCard({
  title,
  location,
  time,
  date,
  members,
  noise,
  tags,
  onView,
}: {
  title: string;
  location: string;
  date: string;
  time: string;
  members: string;
  noise: string;
  tags: string[];
  onView?: () => void;
}) {
  return (
    <div
      className='
        bg-white 
        rounded-[20px] 
        shadow-md 
        outline-1 outline-gray-200 
        p-6 
        w-full 
        h-auto 
        min-h-[250px] 
        flex flex-col justify-between
        overflow-hidden
        break-words
      '
    >
      <div className='text-gray-900 text-base font-bold mb-2'>{title}</div>
      <div className='flex items-center text-gray-600 text-sm gap-2'>
        <CiLocationOn />
        {location}
      </div>
      <div className='flex items-center text-gray-600 text-sm gap-2'>
        <CiClock1 />
        {time} - {date}
      </div>

      <div className='flex items-center text-gray-600 text-sm gap-2'>
        <GoPeople />
        {members}
      </div>

      <div className='flex items-center text-gray-600 text-sm gap-2 mb-3'>
        <IoVolumeHighOutline />
        {noise}
      </div>
      <div className='flex flex-wrap gap-1 mb-4'>
        {tags &&
          tags.map((tag, index) => (
            <div
              key={`${tag} ${index}`}
              className='bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded'
            >
              {tag}
            </div>
          ))}
      </div>
      <button
        className='w-[20%] bg-blue-600 text-white px-4 py-2 rounded-md self-end cursor-pointer'
        onClick={onView}
      >
        View
      </button>
    </div>
  );
}

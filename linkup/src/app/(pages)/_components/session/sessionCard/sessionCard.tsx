// Card for Sessions in Browse
"use client";

import SessionPopup from "../sessionPopup/sessionPopup";


/*
  Make sure the View button opens up a SessionPopup component with the session details
  Restyle the cards to match design in figma more closely
*/
export default function SessionCard({
  title,
  location,
  time,
  members,
  noise,
  tags,
}: {
  title: string;
  location: string;
  time: string;
  members: string;
  noise: string;
  tags: string[];
}) {
  return (
    <div
      className="
  bg-white 
  rounded-[20px] 
  shadow-md 
  outline outline-1 outline-gray-200 
  p-6 
  w-full 
  h-auto 
  min-h-[250px] 
  flex flex-col justify-between
  overflow-hidden
  break-words
"
    >
      <div className="text-gray-900 text-base font-bold mb-2">{title}</div>
      <div className="text-gray-600 text-sm mb-1">{location}</div>
      <div className="text-gray-600 text-xs mb-1">{time}</div>
      <div className="text-gray-600 text-xs mb-1">{members} Members</div>
      <div className="text-gray-600 text-sm mb-1">{noise}</div>
      <div className="flex flex-wrap gap-1 mb-4">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {tag}
          </div>
        ))}
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
        View
      </button>
    </div>
  );
}

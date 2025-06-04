"use client";

interface Session {
    id: string;
    title: string;
    location: string;
    time: string;
    date: string;
    createdBy: string;
    attendees?: string[];
  }

export default function SessionPreview({ session }: { session: Session }) {
  const { title, time, date, location, attendees = [] } = session;
  const displayAttendees = attendees.slice(0, 3);
  const remaining = attendees.length - displayAttendees.length;

  return (
    <div className="w-full h-24 bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-200 px-6 py-4 flex items-center justify-between font-['Inter']">
      {/* Left: Icon */}
      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center mr-6">
        <div className="w-5 h-5 border border-gray-600 rounded-sm" />
      </div>

      {/* Center: Text */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm font-bold leading-normal truncate">
          {title}
        </p>
        <p className="text-gray-600 text-sm font-normal leading-normal truncate">
          {date}, {time} • {location}
        </p>
      </div>

      {/* Right: Avatars */}
      <div className="flex items-center gap-2 ml-4">
        {displayAttendees.map((label, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-gray-700 text-xs font-normal leading-none"
          >
            {label}
          </div>
        ))}
        {remaining > 0 && (
          <div className="text-gray-500 text-sm font-normal leading-tight">
            +{remaining} more
          </div>
        )}
      </div>
    </div>
  );
}

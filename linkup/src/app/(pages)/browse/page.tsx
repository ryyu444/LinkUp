import ProtectedRoute from "../_components/protectedRoute/protectedRoute";
import SessionCard from "../_components/session/sessionCard/sessionCard";

/*
    Corresponds to Browse figma page
    1. Get session data from props
    2. Filter out full sessions and ones made by you
    3. Create state for the filters
    4. Create filter inputs
    5. Create available session displays that updates when filters are applied
*/
export default function Browse() {
  const dummySessions = [
    {
      title: "Data Structures & Algorithms",
      location: "Shields Library",
      time: "3:00 PM - 5:00 PM",
      members: "3/5",
      noise: "Quiet",
      tags: ["Algorithms", "CS", "Homework"],
    },
    {
      title: "Cellular Biology Exam Prep",
      location: "Esau Hall",
      time: "10:00 AM - 12:00 PM",
      members: "4/8",
      noise: "Moderate",
      tags: ["Biology", "Exam", "Group"],
    },
    {
      title: "MAT 21C Study Group",
      location: "Math Building",
      time: "4:30 PM - 6:30 PM",
      members: "2/6",
      noise: "Silent",
      tags: ["Math", "Calculus", "Study"],
    },
    {
      title: "Fluid Mechanics Homework",
      location: "Bainer Hall",
      time: "5:00 PM - 7:30 PM",
      members: "5/8",
      noise: "Quiet",
      tags: ["Engineering", "Homework"],
    },
    {
      title: "ECS 162 Workshop",
      location: "Virtual (Zoom)",
      time: "7:00 PM - 9:00 PM",
      members: "8/15",
      noise: "Moderate",
      tags: ["CS", "Web Dev", "Workshop"],
    },
  ];
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
            Available Sessions ({dummySessions.length})
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
          {dummySessions.slice(0, 6).map((session, index) => (
            <SessionCard key={index} {...session} />
          ))}
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

import Navbar from '../_components/navbar/navbar';
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';

/*
    Corresponds to My Sessions in figma
    1. Get the sessions from props
    2. Separate the sessions that are upcoming vs. past + filter out full sessions
    3. Pass the split data into sessionPreview components
    4. Style properly
*/
export default function Sessions() {
  return (
    <ProtectedRoute>
      <main className="bg-[#f8f8f8] pl-[55.33px] pr-[55.33px] pt-[20.5px]">
        <h2 className="text-2xl font-bold font-[Inter] text-[#002855] mb-1">
          Create Session
        </h2>
        <p className="text-xs font-[Inter] text-[#4B5563]">
          Make a study session to study with other students
        </p>

        {/* Inputs */}
        <div className="mt-6"> 

          {/* Subject or Session Name */}
          <div className="mb-8">
            <label className="text-sm font-semibold font-[Inter] text-[#002855]">
              Subject or Session Name
            </label>
            <input className="bg-white w-full px-4 py-2 border rounded font-[Inter]"></input>
          </div>
          
          {/* Location, Time Start, Time End */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
                Location
              </label>
              <input className="bg-white w-lg px-4 py-2 border rounded font-[Inter]" />
            </div>
            
            <div className="pl-4 col-span-1">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
                Time Start
              </label>
              <input className="bg-white w-full px-4 py-2 border rounded font-[Inter]" />
            </div>
            
            <div className="pl-4 col-span-1">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
                Time End
              </label>
              <input className="bg-white w-full px-4 py-2 border rounded font-[Inter]" />
            </div>
          </div>

          {/* Second Row: Group Size, Noise Level, Day */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
              Group Size
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  max="10" 
                  value="0"
                  className="bg-white w-full pl-2 pr-12 py-2 border rounded font-[Inter] text-center"
                  readOnly
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                  <button className="text-gray-600 hover:text-gray-800 leading-none">
                    ▲
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 leading-none">
                    ▼
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pl-20 col-span-2">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
                Noise Level
              </label>
              <div className="flex gap-2">
                <button className="px-3 py-2.5 border rounded font-[Inter] text-sm bg-white hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300">
                  Silent
                </button>
                <button className="px-3 py-2.5 border rounded font-[Inter] text-sm bg-white hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300">
                  Quiet
                </button>
                <button className="px-3 py-2.5 border rounded font-[Inter] text-sm bg-white hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300">
                  Moderate
                </button>
                <button className="px-3 py-2.5 border rounded font-[Inter] text-sm bg-white hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300">
                  Collaborative
                </button>
              </div>
            </div>
          
            <div className="col-span-1">
              <label className="block text-sm font-semibold font-[Inter] text-[#002855]">
                Day
              </label>
              <input className="bg-white w-full pl-2 pr-4 py-2 border rounded font-[Inter]" />
            </div>
          </div>

           {/* Session Description */}
          <label className="mb-8 text-sm font-semibold font-[Inter] text-[#002855]">
          Session Description
          </label>
          <input className="bg-white w-full px-2 py-30 border rounded font-[Inter]"></input>
          <p className="text-xs font-[Inter] text-[#4B5563]">
          300 words max
          </p>
        </div>

        <div className=" pl-[1000px] pt-[42px]">
          <button className="w-full bg-[#2563EB] text-white py-2 rounded hover:bg-blue-800 transition">
            Create Sesssion
          </button>
        </div>

      </main>
    </ProtectedRoute>
  );
}

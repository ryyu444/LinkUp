'use client';

import { Users, Clock, Plus } from 'lucide-react';

export default function StatCard() {
  return (
    <div className="w-full h-60 bg-white rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] outline-gray-200 p-6 font-['Inter']">
      <div className='text-sky-950 text-lg font-bold leading-7 mb-6'>
        Your Stats
      </div>

      {/* Grid of stats */}
      <div className='grid grid-cols-2 gap-y-8'>
        {/* Sessions Joined */}
        <div className='flex items-start space-x-4'>
          <div className='w-5 h-5 mt-1 text-gray-600'>
            <Users className='w-5 h-5' />
          </div>
          <div>
            <p className='text-gray-600 text-sm leading-tight'>
              Sessions Joined
            </p>
            <p className='text-gray-900 text-3xl font-bold leading-9'>12</p>
          </div>
        </div>

        {/* Sessions Created */}
        <div className='flex items-start space-x-4'>
          <div className='w-5 h-5 mt-1 text-gray-600'>
            <Plus className='w-5 h-5' />
          </div>
          <div>
            <p className='text-gray-600 text-sm leading-tight'>
              Sessions Created
            </p>
            <p className='text-gray-900 text-3xl font-bold leading-9'>5</p>
          </div>
        </div>

        {/* Study Hours */}
        <div className='flex items-start space-x-4'>
          <div className='w-5 h-5 mt-1 text-gray-600'>
            <Clock className='w-5 h-5' />
          </div>
          <div>
            <p className='text-gray-600 text-sm leading-tight'>Study Hours</p>
            <p className='text-gray-900 text-2xl font-bold leading-9'>24</p>
          </div>
        </div>

        {/* Connections */}
        <div className='flex items-start space-x-4'>
          <div className='w-5 h-5 mt-1 text-gray-600'>
            <Users className='w-5 h-5' />
          </div>
          <div>
            <p className='text-gray-600 text-sm leading-tight'>Connections</p>
            <p className='text-gray-900 text-3xl font-bold leading-9'>8</p>
          </div>
        </div>
      </div>
    </div>
  );
}

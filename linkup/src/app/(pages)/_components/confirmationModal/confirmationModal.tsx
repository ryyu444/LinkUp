'use client';
import { useRouter } from 'next/navigation';

/*
    Corresponds to Confirmation Popup in Figma
    1. Make sure this takes in props: Session title
    2. Create the popup content
        - My Sessions: redirect to /sessions
        - Dashboard: redirect to /dashboard
    3. Used for create & join
*/

interface ConfirmationModalProps {
  isOpen: boolean;
  handler: () => void;
  sessionTitle: string;
  action: 'created' | 'registered';
}

export default function ConfirmationModal({
  isOpen,
  handler,
  sessionTitle,
  action,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const router = useRouter();

  const handleDashboardClick = () => {
    handler();
    router.push('/dashboard');
  };

  const handleSessionsClick = () => {
    handler();
    router.push('/sessions');
  };

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-md p-12 max-w-lg h-120 w-full mx-4 shadow-lg relative font-[Inter]'>
        <button
          onClick={handler}
          className='absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light'
        >
          ×
        </button>

        <div className=' text-center'>
          <h2 className='mt-5 text-3xl font-bold text-[#002855] mb-20'>
            Study Success!
          </h2>

          <p className='mb-1'>
            You have {action} {action === 'registered' ? 'for' : ''} the session
          </p>
          <h3 className='text-2xl font-bold mb-30'>{sessionTitle}</h3>

          <div className='flex gap-4 justify-center'>
            <button
              onClick={handleSessionsClick}
              className='bg-[#002855] text-xs text-white px-4 py-2 rounded-sm hover:bg-blue-800 transition-colors'
            >
              My Sessions
            </button>
            <button
              onClick={handleDashboardClick}
              className='bg-[#2563EB] text-xs text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors'
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import {useState} from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import InfoCard from '../_components/dashboard/infoCard/infoCard';
import ActivityCard from '../_components/dashboard/activityCard/activityCard';
import StatCard from '../_components/dashboard/statCard/statCard';
import SessionPopup from '../_components/session/sessionPopup/sessionPopup';
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';
import ConfirmationModal from '../_components/confirmationModal/confirmationModal';

/*
    Corresponds to Dashboard page in figma
    1. Get sessions from props
    2. Filter to find the most upcoming sessions
    3. Render the following as info cards: Browse, Create, and My Sessions
        - Browse: Redirect to /browse
        - Create: use sessionPopup & render with create button (POST request with form data to save session to firestore)
        - My Sessions: redirect to /sessions
    4. Render the upcoming sessions with sessionPreview component (view all redirects to /browse)
    5. Render activities with activityCard (idk how we do the recent stuff tho)
    6. Render stats with statCard (maybe we track stats in the user profile we store in db)
*/
export default function Dashboard() {
  const [openPopup, setOpenPopup] = useState(false)
  const router = useRouter()

  return (
    <ProtectedRoute>
      <button className='rounded px-4 py-2 bg-red-400' onClick ={() => setOpenPopup(true)}>popup</button>
      <div>dashboard</div>
      
      <ConfirmationModal
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        sessionTitle="Test Session"
        onNavigateToSessions={() => {
          setOpenPopup(false)
          router.push('/sessions')
        }}
        onNavigateToDashboard={() => {
          setOpenPopup(false)
          router.push('/dashboard')
        }}
      />
    </ProtectedRoute>
  );
}

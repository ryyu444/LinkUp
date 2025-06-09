import ProtectedRoute from '../_components/protectedRoute/protectedRoute';
import Link from 'next/link';
import Profile from '../_components/profile/profile';
import InfoCard from '../_components/dashboard/infoCard/infoCard';
import ActivityCard from '../_components/dashboard/activityCard/activityCard';
import StatCard from '../_components/dashboard/statCard/statCard';
import SessionPopup from '../_components/session/sessionPopup/sessionPopup';
import SessionPreview from '../_components/session/sessionPreview/sessionPreview';

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
  return (
    <ProtectedRoute>
      <div>
        <Link href="/user">
          <div className="w-[500px] h-[200px] bg-[#F0F0F0]">
            click the div  to go to profile
          </div>
        </Link>
      </div>
    </ProtectedRoute>
  );
}

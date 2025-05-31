import Profile from '../../_components/profile/profile';
import ProtectedRoute from '../../_components/protectedRoute/protectedRoute';

/*
    - Corresponds to Profile Page in figma.
    1. Fill out with About Me, Headshot, and Preferences: store in user from AuthContext
    2. Edit Profile - Popup that has info prefilled & allows for updates
    2a. For the profile popup, they will use the Profile component
    2b. Makes sure that the user can cancel (close popup) or save changes (POST changes from form to firestore)
    3. Back to dashboard: Redirect to /dashboard
*/
export default function MyUser() {
  return (
    <ProtectedRoute>
      <div>profile</div>
    </ProtectedRoute>
  );
}

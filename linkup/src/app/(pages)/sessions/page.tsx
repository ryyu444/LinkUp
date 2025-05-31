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
      <div>my sessions</div>
    </ProtectedRoute>
  );
}

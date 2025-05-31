import ProtectedRoute from '../_components/protectedRoute/protectedRoute';

/*
    Corresponds to Browse figma page
    1. Get session data from props
    2. Filter out full sessions and ones made by you
    3. Create state for the filters
    4. Create filter inputs
    5. Create available session displays that updates when filters are applied
*/
export default function Browse() {
  return (
    <ProtectedRoute>
      <div>browse sessions</div>
    </ProtectedRoute>
  );
}

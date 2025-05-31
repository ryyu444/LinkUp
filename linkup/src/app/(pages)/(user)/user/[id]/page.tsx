import ProtectedRoute from '@/app/(pages)/_components/protectedRoute/protectedRoute';
/*
  This page will be for when a user clicks on some other person's profile.
  1. Fetch the other person's profile using the id from the db
  2. Render it like your own profile just without the edit profile button
*/
export default async function User({ params }: any) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <div>User Id: {id}</div>
    </ProtectedRoute>
  );
}

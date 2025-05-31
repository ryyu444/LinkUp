import React from 'react';

// Add the similar left hand side of login/sign up and make sure the form is to the right of it
export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>hi{children}</div>;
}

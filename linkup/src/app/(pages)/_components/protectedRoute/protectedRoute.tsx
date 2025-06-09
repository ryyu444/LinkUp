'use client';

import { useEffect, useContext } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { AuthContext } from '../../_contexts/AuthContext';

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useContext(AuthContext);
  const path = usePathname();

  console.log('ProtectedRoute');
  console.log('Current Path:', path);

  // only check for redirects if the path changes.
  useEffect(() => {
    // if (loading) return;
    if (!user) {
      if (path !== '/login' && path !== '/register') {
        redirect('/login');
      }
    } else if (path === '/login' || path === '/register') {
      redirect('/dashboard');
    }
  }, [path, loading, user]);

  // If loading, do not render anything 
  // can modify this to show a loading spinner or skeleton
  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}

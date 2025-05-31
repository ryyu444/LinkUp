'use client';
import { useContext } from 'react';
import { AuthContext } from '../../_contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function ProtectedRoute({ children }: any) {
  const { user } = useContext(AuthContext);

  if (!user) {
    redirect('/login');
  }

  return children;
}

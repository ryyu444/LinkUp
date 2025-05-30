'use client';

import { useState, useEffect, createContext } from 'react';
import {
  handleGoogleLogin,
  handleEmailPasswordLogin,
} from '@/(api)/_lib/auth/authHandlers';
import User from '@/app/_types/auth/User';

export const AuthContext = createContext({});

/**
 *
 * @returns Auth Context Provider used to track current user info for handling login/logout and specific rendering
 */
export function AuthContextProvider() {
  const [user, setUser] = useState<User | null>(null);
  return;
}

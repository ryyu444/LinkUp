'use client';

import { useState, useEffect, createContext } from 'react';
import { getFirebaseAuth } from '@/(api)/_lib/firebase/firebaseClient';
import {
  handleGoogleSetup,
  handleEmailPasswordSetup,
} from '@/(api)/_lib/auth/authHandlers';
import User from '@/app/_types/auth/User';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    type: 'Google' | 'EmailPassword',
    method: 'login' | 'signup',
    form: FormData
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

/**
 *
 * @returns Auth Context Provider used to track current user info for handling login/logout and specific rendering
 */
export function AuthContextProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getFirebaseAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uuid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Unnamed',
          createdAt: new Date(),
          provider: firebaseUser.providerData[0]?.providerId || 'unknown',
          profileSaved: true,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  console.log('AuthContextProvider');
  console.log('Current User:', user);
  // signup - implement; need to handle invalid logins
  /**
   *
   * @param type Input "Google" or "EmailPassword" to select method type
   * @param method Input "login" or "signup" to select method
   * @param form Form Data with Name, Email, and Password
   * @returns
   */
  const login = async (type: String, method: String, form: FormData) => {
    try {
      if (type === 'Google') {
        await handleGoogleSetup();
      } else {
        await handleEmailPasswordSetup(method, form);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  // logout
  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

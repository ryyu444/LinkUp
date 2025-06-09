'use client';

import { useState, createContext } from 'react';
import {
  handleGoogleSetup,
  handleEmailPasswordSetup,
} from '@/(api)/_lib/auth/authHandlers';
import User from '@/app/_types/auth/User';

interface AuthContextType {
  user: User | null;
  login: (type: 'Google' | 'EmailPassword', method: 'login' | 'signup', form: FormData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 *
 * @returns Auth Context Provider used to track current user info for handling login/logout and specific rendering
 */
export function AuthContextProvider({ children }: any) {
  const [user, setUser] = useState<User | null>({
    username: 'john',
    password: 'smith',
    accessToken: '0',
  });

  // signup - implement; need to handle invalid logins
  /**
   *
   * @param type Input "Google" or "EmailPassword" to select method type
   * @param method Input "login" or "signup" to select method
   * @param form Form Data with Name, Email, and Password
   * @returns
   */
  const login = async (type: String, method: String, form: FormData) => {
    let user = null;
    let attempts = 0;

    while (attempts < 3 && !user) {
      if (type === 'Google') {
        user = await handleGoogleSetup();
      } else {
        user = await handleEmailPasswordSetup(method, form);
      }
      attempts++;
    }

    if (!user) {
      throw new Error('Login failed after 3 attempts');
    }

    setUser(user);
    return;
  };

  // logout
  const logout = async () => {
    setUser(null);
    return;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

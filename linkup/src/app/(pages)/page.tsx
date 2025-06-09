'use client';

import { useEffect, useContext, useState } from 'react';
import { getFirebaseDB, getFirebaseAuth } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from './_contexts/AuthContext';
import Profile from './_components/profile/profile';
import User from '../_types/auth/User';

async function testDB() {
  const db = getFirebaseDB();

  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const userList: User[] = usersSnapshot.docs.map((user) => {
    const data = user.data();
    const username = data.username || data.email; // fallback if no username
    const password = data.password;
    const accessToken = user.id;

    return { username, password, accessToken };
  });

  console.log('📦 User list from Firestore:', userList);
}

// Actual login function using Firebase Auth
async function loginWithEmailPassword(email: string, password: string) {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Login successful!');
    console.log('👤 User Info:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      metadata: user.metadata,
    });

    return user;
  } catch (error) {
    console.error('❌ Login failed:', error);
    return null;
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    testDB();
  }, []);

  const authContext = useContext(AuthContext);
  console.log('🔐 Auth context:', authContext);

  if (!user) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', width: '280px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', width: '280px' }}
        />
        <button
          onClick={async () => {
            const loggedIn = await loginWithEmailPassword(email, password);
            if (loggedIn) {
              setUser({
                username: loggedIn.displayName ?? loggedIn.email ?? 'No name',
                accessToken: loggedIn.uid,
                password: '', // Never store password in memory
              });
            } else {
              alert('Login failed. Please check your credentials.');
            }
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          Sign in with Email
        </button>
        <div>username is mingzhetest@test.com, and password is 123123</div>
      </div>
    );
  }

  return (
    <div>
      <Profile />
    </div>
  );
}

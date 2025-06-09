// to run this file: node --loader ts-node/esm "src/(api)/_lib/firebase/seedTestUsers.ts" 

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const testUsers = [
  { uid: '45T1ZjizSMY3p02T9fWRzF5ekTE3', email: 'test1234@gmail.com' },
  { uid: 'Br7Jmv8kDUaOOyHHUFs3Fb88Fx12', email: 'test@example.com' },
  { uid: 'pZTl8YZbwiNmewfApsp7Ihi3EQW2', email: '12345@gmail.com' },
];

async function seedUsers() {
  // initialize the Firebase app with the config
  const app = initializeApp(firebaseConfig);
  // get a reference to the Firestore database
  const db = getFirestore(app);

  for (const user of testUsers) {
    try {
      // set a document in user
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        // generate display name from email prefix
        displayName: user.email.split('@')[0],
        // auto store the server timestamp
        // createdAt: serverTimestamp(),
      });

      console.log(`✅ Seeded user ${user.email}`);
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Failed to seed ${user.email}:`, error.message);
    }
  }
}

seedUsers();

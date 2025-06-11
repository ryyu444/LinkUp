// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

/**
 *
 * @returns A connection to Firebase
 */
export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

/**
 *
 * @returns An instance of the Firebase app
 */
export function getFirebaseApp(): FirebaseApp {
  const client = initFirebase();
  return client;
}

/**
 *
 * @returns A connection to the Firestore database
 */

// note: Check Firestore rules to ensure we have correct read/write perms.
export function getFirebaseDB(): Firestore {
  const client = initFirebase();
  const db = getFirestore(client);

  return db;
}

/**
 *
 * @returns A connection to Firebase's Authentication system
 */
export function getFirebaseAuth(): Auth {
  const client = initFirebase();
  const authInst = getAuth(client);

  return authInst;
}

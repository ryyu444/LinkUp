import { getFirebaseDB } from '../firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Session from '@/app/_types/session/Session';

export async function addSession(session: Partial<Session>) {
  const db = getFirebaseDB();
  const newEntry = {
    host: session.host,
    title: session.title,
    description: session.description,
    day: session.day,
    startTime: session.startTime,
    endTime: session.endTime,
    location: session.location,
    noise: session.noise,
    capacity: session.capacity,
    registered: session.registered ?? [],
    tags: session.tags ?? [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'sessions'), newEntry);

  return { ...newEntry, sessionID: docRef.id }; // returns the new session with its ID
}

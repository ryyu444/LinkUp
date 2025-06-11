import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFirebaseDB } from '../firebaseClient';

/**
 * Adds current user to session.registered and adds sessionID to user.registeredSessions.
 *
 * @param sessionID - ID of the session to join
 * @param userUuid - UUID of the user joining
 * @param onSuccess - Callback function to run after successful join
 */
export const joinSession = async (
  sessionID: string,
  userUuid: string,
  onSuccess: () => void
) => {
  try {
    const db = getFirebaseDB();

    // 1️⃣ Fetch session
    const sessionRef = doc(db, 'sessions', sessionID);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      console.error('Session not found');
      return;
    }

    // 2️⃣ Add user to session.registered
    await updateDoc(sessionRef, {
      registered: arrayUnion(userUuid),
    });

    // 3️⃣ Fetch user
    const userRef = doc(db, 'users', userUuid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('User not found');
      return;
    }

    // 4️⃣ Add session to user.registeredSessions
    await updateDoc(userRef, {
      registeredSessions: arrayUnion(sessionID),
    });

    console.log(`User ${userUuid} joined session ${sessionID}`);

    // 5️⃣ Run success callback (close popup + show confirmation)
    onSuccess();
  } catch (error) {
    console.error('Error joining session:', error);
  }
};

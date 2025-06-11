import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getFirebaseDB } from '../firebaseClient';

/**
 * Removes current user from session.registered and removes sessionID from user.registeredSessions.
 *
 * @param sessionID - ID of the session to leave
 * @param userUuid - UUID of the user leaving
 * @param onSuccess - Callback function to run after successful leave
 */
export const leaveSession = async (
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

    // 2️⃣ Remove user from session.registered
    await updateDoc(sessionRef, {
      registered: arrayRemove(userUuid),
    });

    // 3️⃣ Fetch user
    const userRef = doc(db, 'users', userUuid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('User not found');
      return;
    }

    // 4️⃣ Remove session from user.registeredSessions
    await updateDoc(userRef, {
      registeredSessions: arrayRemove(sessionID),
    });

    console.log(`User ${userUuid} left session ${sessionID}`);

    // 5️⃣ Run success callback
    onSuccess();
  } catch (error) {
    console.error('Error leaving session:', error);
  }
};

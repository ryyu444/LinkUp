import User from '@/app/_types/auth/User';
import { getFirebaseAuth, getFirebaseDB } from '../firebase/firebaseClient';
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const auth = getFirebaseAuth();
const db = getFirebaseDB();
/* 
    https://firebase.google.com/docs/auth/web/google-signin#web_8    
    1. Create a button that specifies sign in with Google
    2. Have the button use this function to handle the logic
    3. Write out logic of this function: Return the User
*/
export async function handleGoogleSetup(): Promise<void> {
  const provider = new GoogleAuthProvider();

  try {
    // open a popup for Google sign-in
    auth.setPersistence(browserSessionPersistence).then(async () => {
      const result = await signInWithPopup(auth, provider);
      console.log(`Google Signin Result: ${result}`);
      // get user info from result
      const firebaseUser = result.user;
      console.log(`User: ${firebaseUser.toJSON()}`);

      // get a reference to the document
      const userRef = doc(db, 'users', firebaseUser.uid);
      // get the data from the document
      const snapshot = await getDoc(userRef);

      // if new Google user, add to Firestore
      if (!snapshot.exists()) {
        const userEntry: User = {
          uuid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Unnamed',
          createdAt: new Date(),
          provider: 'google',
        };
        await setDoc(userRef, userEntry);
      }
      
    });
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    throw new Error('Google sign-in failed.');
  }
}

/* 
    https://firebase.google.com/docs/auth/web/password-auth#web
    1. Have a form that takes in email + password
    2. Send the form data to this function to handle
    3. Write out logic of this function: Return the user if there is a match; Return null if invalid
*/
export async function handleEmailPasswordSetup(
  type: String,
  form: FormData
): Promise<void> {
  // extract email and password from form
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  try {
    auth.setPersistence(browserSessionPersistence).then(async () => {
      let userCredential;
      // handle the signup
      if (type === 'signup') {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else if (type == 'login') {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        throw new Error('Invalid authentication type.');
      }

      // get Firebase user
      const user = userCredential.user;

      console.log(`Email & Password User: ${user.toJSON()}`);
      // get a reference to the document and get data from the document
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      // Double-check if profile exists in Firestore
      if (!snapshot.exists()) {
        const userEntry: User = {
          uuid: user.uid,
          email: user.email,
          displayName: email.split('@')[0], // use email prefix as display name
          createdAt: new Date(),
          provider: 'email',
        };
        await setDoc(userRef, userEntry);
      }
    });
  } catch (err: any) {
    console.error(`${type} error:`, err);
    // handle login errors
    type = type.toString();
    if (type === 'login') {
      if (err.code === 'auth/user-not-found') {
        throw new Error('No user found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('The email address is badly formatted.');
      } else if (err.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      }
    }

    // handle signup errors
    if (type === 'signup') {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error(
          'This email is already in use. Try logging in instead.'
        );
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('The email address is badly formatted.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      }
    }

    // fallback
    throw new Error('Authentication failed. Please try again.');
  }
}

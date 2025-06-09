import User from '@/app/_types/auth/User';
import { getFirebaseAuth, getFirebaseDB } from '../firebase/firebaseClient';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
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
export async function handleGoogleSetup(): Promise<User> {
  const provider = new GoogleAuthProvider();
  
   try {
    // open a popup for Google sign-in
    const result = await signInWithPopup(auth, provider);
    // get user info from result
    const firebaseUser = result.user;
    // get Firebase JWT token
    const token = await firebaseUser.getIdToken();
    // get a reference to the document
    const userRef = doc(db, 'users', firebaseUser.uid);
    // get the data from the document
    const snapshot = await getDoc(userRef);

    // if new Google user, add to Firestore
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Unnamed',
        createdAt: new Date(),
        provider: 'google'
      });
    }

    // return the app's User object
    return {
      username: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
      password: 'google-auth', // dummy value to satisfy your type
      accessToken: token,
    };
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
  type: string,
  form: FormData
): Promise<User | null> {
  // extract email and password from form
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  try {
    let userCredential;
    // handle the signuo
    if (type === 'signup') {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // get Firebase user
      const user = userCredential.user;
      // get a reference to the document and get data from the document
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      // Double-check if profile exists in Firestore
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: email.split('@')[0],
          createdAt: new Date(),
          provider: 'email'
        });
      }

    } else if (type == 'login') {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }else{
      throw new Error('Invalid authentication type.');
    }

    // get Firebase user
    const user = userCredential.user;
    const token = await user.getIdToken();
    // return the app's User object
    return {
      username: user.email || 'No email',
      password: 'firebase-auth', // dummy value
      accessToken: token,
    };
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
          throw new Error('This email is already in use. Try logging in instead.');
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

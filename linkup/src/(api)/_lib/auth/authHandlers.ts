import User from '@/app/_types/auth/User';
import { getFirebaseAuth } from '../firebase/firebaseClient';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const auth = getFirebaseAuth();

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
  type: String,
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
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    console.error('Email/Password Auth Error:', err);
    throw new Error('Authentication failed. Please check your credentials.');
  }
}

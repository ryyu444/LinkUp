import User from '@/app/_types/auth/User';
import { getFirebaseAuth } from '../firebase/firebaseClient';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
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
  return {
    username: 'John',
    password: 'Doe',
    accessToken: '0',
  };
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
  // break down form into email and password
  let email = '';
  let password = '';

  let user = null;

  if (type === 'signup') {
    user = await createUserWithEmailAndPassword(auth, email, password);
  } else {
    user = await signInWithEmailAndPassword(auth, email, password);
  }

  return {
    username: 'John',
    password: 'Doe',
    accessToken: '0',
  };
}

import { getFirebaseAuth } from '../firebase/firebaseClient';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const auth = getFirebaseAuth();

/* 
    https://firebase.google.com/docs/auth/web/google-signin#web_8    
    1. Create a button that specifies sign in with Google
    2. Have the button use this function to handle the logic
    3. Write out logic of this function
*/
export async function handleGoogleLogin() {
  return;
}

/* 
    https://firebase.google.com/docs/auth/web/password-auth#web
    1. Have a form that takes in email + password
    2. Send the form data to this function to handle
    3. Write out logic of this function
*/
export async function handleEmailPasswordLogin(form: FormData) {
  return;
}

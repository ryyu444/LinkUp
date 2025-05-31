"use client";

import { useState, useContext } from 'react';
import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
import Profile from '@/app/(pages)/_components/profile/profile';

/*
    Corresponds to Sign Up page in figma
    1. Create form that takes in all the sign up information
    2. Create button that allows sign up with Google
    3. Use the login function provided by AuthContext and pass in "signup" method and type for both buttons
    4. Once the signup is successful, show a popup with the profile component for the user to fill their info
*/
export default function Register() {
  const { login } = useContext(AuthContext);
  return <div>sign-up</div>;
}

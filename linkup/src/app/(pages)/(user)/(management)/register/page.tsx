"use client";

import { useState, useContext } from 'react';
import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
// import Profile from '@/app/(pages)/_components/profile/profile';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/*
    Corresponds to Sign Up page in figma
    1. Create form that takes in all the sign up information
    2. Create button that allows sign up with Google
    3. Use the login function provided by AuthContext and pass in "signup" method and type for both buttons
    4. Once the signup is successful, show a popup with the profile component for the user to fill their info
*/
export default function Register() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  // form input states
  const [form, setForm] = useState({
    first: '',
    last: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  // const [showProfile, setShowProfile] = useState(false);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Email/password sign up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // check if passwords match
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // create FormData for submission
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('first', form.first);
      formData.append('last', form.last);
      // call login with signup info
      await login('EmailPassword', 'signup', formData);
      // move to dashboard when signuo success
      router.push('/dashboard');
      //setShowProfile(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    }
  };

  // Google sign up
  const handleGoogleSignup = async () => {
    try {
      // call login for Google signup
      await login('Google', 'signup', new FormData());
      // move to dashboard when signuo success
      router.push('/dashboard');
      //setShowProfile(true);
    } catch (err: any) {
      setError(err.message || 'Google signup failed.');
    }
  };

  return (
    <div className="flex flex-col w-1/2">
      {/* the right part */}
      {/* Heading */}
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Create your account</h2>
      {/* subtext with link to login */}
      <p className="text-sm text-gray-600 mb-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-700 hover:underline">
          Log in
        </Link>
      </p>
      {/* the signup form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="flex gap-4">
          <input
            name="first"
            placeholder="First Name"
            className="w-1/2 px-4 py-2 border rounded"
            value={form.first}
            onChange={handleChange}
            required
          />
          <input
            name="last"
            placeholder="Last Name"
            className="w-1/2 px-4 py-2 border rounded"
            value={form.last}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {/* submit button */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
          Create Account
        </button>
      </form>
      {/* or continue with  */}
      <div className="my-6 flex items-center gap-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-sm text-gray-500">or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      {/* Google Signup button */}
      <button
        onClick={handleGoogleSignup}
        className="w-full border px-4 py-2 rounded flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition"
      >
        <Image src="/googleicon.png" alt="Google icon" width={20} height={20} />
        Sign up with Google
      </button>

      {/* Profile Modal (optional feature) */}
      {/* {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <Profile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )} */}
    </div>
  );
}

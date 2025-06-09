'use client';

import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
import { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/*
    Corresponds to Login page in Figma
    1. Similar to register. Check that page.tsx for register implementation
    2. Differences: Pass in "login" for method
*/
export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  // form input states
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // create FormData
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('password', form.password);
      // trigger login method
      await login('EmailPassword', 'login', formData);
      // move to dashboard when login success
      //redirect('/dashboard');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login Failed.');
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      // google login trigger
      await login('Google', 'login', new FormData());
      //redirect('/dashboard');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Login Failed.');
    }
  };

  return (
    <div className="flex flex-col w-1/2">
      {/* the right part */}
      <h2 className='text-2xl font-bold text-blue-900 mb-1'>Login</h2>
      <p className='text-sm text-gray-600 mb-6'>
        New to LinkUp?{' '}
        <Link href='/register' className='text-blue-700 hover:underline'>
          Sign Up
        </Link>
      </p>
      {/* login Form */}
      <form onSubmit={handleLogin} className='space-y-4'>
        <input
          name='email'
          type='email'
          placeholder='Email Address'
          className='w-full px-4 py-2 border rounded'
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          className='w-full px-4 py-2 border rounded'
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className='text-sm text-red-600'>{error}</p>}
        {/* submit Button */}
        <button
          type='submit'
          className='w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition'
        >
          Log In
        </button>
      </form>

      <div className='my-6 flex items-center gap-4'>
        <hr className='flex-grow border-gray-300' />
        <span className='text-sm text-gray-500'>or continue with</span>
        <hr className='flex-grow border-gray-300' />
      </div>
      {/* google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className='w-full border px-4 py-2 rounded flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition'
      >
        <Image src='/googleicon.png' alt='Google icon' width={20} height={20} />
        Sign in with Google
      </button>
    </div>
  );
}

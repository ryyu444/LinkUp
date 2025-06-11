'use client';

import { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
import { Button } from '@/app/(pages)/_components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

/*
  TODO
   1. Need to render the login and signup buttons only if the user is not logged in
   2. If the user is logged in, render a profile icon that opens a dropdown menu with profile, my sessions, and logout
*/
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // hide the navbar in login and sign up page
  const pathname = usePathname();
  const hide = pathname === '/login' || pathname === '/register';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (hide) return null;

  // hide the right button when user is logged in
  return (
    // space between logo and buttons with padding and bottom border
    <header className='h-[64px] flex justify-between items-center p-6 border-b'>
      {/* the logo */}
      <div className='flex items-center space-x-2'>
        <Image src='/logo.png' alt='LinkUp Logo' width={32} height={32} />
        <span className='text-xl font-bold text-blue-950'>LinkUp</span>
      </div>
      {/* Right side */}
      {!user ? (
        <div className='space-x-4'>
          <Link href='/login'>
            <Button variant='outline'>Login</Button>
          </Link>
          <Link href='/register'>
            <Button>Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div ref={dropdownRef} className='relative'>
          {/* Profile icon (always visible) */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className='w-10 h-10 rounded-full bg-blue-200 text-blue-950 font-bold flex items-center justify-center hover:bg-blue-300 transition-all'
          >
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 p-4'>
              {/* Top: profile icon and close button */}
              <div className='flex justify-between items-center mb-4'>
                <div className='w-9 h-9 rounded-full bg-blue-200 text-blue-950 font-bold flex items-center justify-center'>
                  {/* show the icon whith first letter of displayName */}
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* X button */}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className='text-gray-500 hover:text-gray-700 text-lg font-bold'
                >
                  ✕
                </button>
              </div>

              {/* Menu links */}
              <Link
                href='/user'
                className='block px-2 py-1 hover:bg-gray-100 rounded'
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href='/dashboard'
                className='block px-2 py-1 hover:bg-gray-100 rounded'
                onClick={() => setIsDropdownOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href='/browse'
                className='block px-2 py-1 hover:bg-gray-100
                rounded'
                onClick={() => setIsDropdownOpen(false)}
              >
                Browse
              </Link>

              <Link
                href='/sessions'
                className='block px-2 py-1 hover:bg-gray-100 rounded'
                onClick={() => setIsDropdownOpen(false)}
              >
                Sessions
              </Link>

              <div className='border-t my-3' />

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                  router.push('/login');
                }}
                className='w-full text-right text-red-600 font-semibold hover:bg-gray-100 px-2 py-1 rounded'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

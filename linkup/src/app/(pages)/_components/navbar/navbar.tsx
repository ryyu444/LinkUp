'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/(pages)/_contexts/AuthContext';
import { Button } from '@/app/(pages)/_components/ui/button';

/*
  TODO
   1. Need to render the login and signup buttons only if the user is not logged in
   2. If the user is logged in, render a profile icon that opens a dropdown menu with profile, my sessions, and logout

*/
export default function Navbar() {
  const auth = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    // space between logo and buttons with padding and bottom border
    <header className='h-[64px] flex justify-between items-center p-6 border-b'>
      {/* the logo */}
      <div className='flex items-center space-x-2'>
        <Image src='/logo.png' alt='LinkUp Logo' width={32} height={32} />
        <span className='text-xl font-bold text-blue-950'>LinkUp</span>
      </div>
      <div className='space-x-4'>
        {/* create the login and signup button */}
        <Link href='/login'>
          <Button variant='outline'>Login</Button>
        </Link>
        <Link href='/register'>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </header>
  );
}

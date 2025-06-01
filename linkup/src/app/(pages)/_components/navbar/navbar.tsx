'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/*
  Render login/signup button only on home page
  Render small circle with user picture if they are logged in
    - Clicking on the circle redirects to /user
*/
export default function Navbar() {
  return (
        // space between logo and buttons with padding and bottom border
        <header className="flex justify-between items-center p-6 border-b">
        {/* the logo */}
        <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="LinkUp Logo" width={32} height={32} />
            <span className="text-xl font-bold text-blue-950">LinkUp</span>
        </div>
        <div className="space-x-4">
            {/* create the login and signup button */}
            <Link href="/login">
            <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
            <Button>Sign Up</Button>
            </Link>
        </div>
        </header>
  );
}

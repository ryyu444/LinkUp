'use client';
import Image from 'next/image';
/*
  Render login/signup button only on home page
  Render small circle with user picture if they are logged in
    - Clicking on the circle redirects to /user
*/
export default function Navbar() {
  return <header className="w-full h-14 bg-white flex items-center justify-between px-3">
            <div className="flex items-center space-x-2">
                <Image 
                src="/Logo.png" 
                alt="LinkUp Logo" 
                width={169} 
                height={41} 
                />
            </div>
            <Image 
            src="/image.png" 
            alt="Profile" 
            width={56} 
            height={56} 
            className= "rounded-full"
            />
        </header>
}

'use client';

import { usePathname } from 'next/navigation';

// any links or logos or descriptions
export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') {
    return null; // Don't show footer on login or signup pages
  }

  return (
    <footer className='flex flex-col p-6 bg-[#002855]'>
      <p className='text-white text-lg'>Made with ❤️ by the LinkUp Team</p>
    </footer>
  );
}

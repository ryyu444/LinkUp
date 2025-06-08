import React from 'react';
import Image from 'next/image';

// Add the similar left hand side of login/sign up and make sure the form is to the right of it
export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='h-screen w-screen bg-blue-50'>
      <div className='flex w-full h-full bg-white shadow-md overflow-hidden'>
        {/* Left Panel */}
        {/* logo */}
        <div className='hidden md:flex flex-col justify-between bg-blue-950 text-white p-8 w-1/2'>
          <Image src='/signin_logo.png' alt='Logo' width={80} height={80} />
          <div className='flex flex-col items-center gap-6'>
            <div className='flex flex-col items-center w-[80%] h-[45rem] relative overflow-hidden'>
              <Image
                src='/library.png'
                alt='Library'
                fill
                style={{ objectFit: 'cover' }}
                sizes='(max-width: 768px) 100vw, 50vw'
                priority
              />
            </div>
          </div>
          {/* image */}
          <div className='text-center flex flex-col items-center'>
            {/* text */}
            <h2 className='text-xl font-semibold text-center'>
              Find your perfect study partners
            </h2>
            <p className='text-sm mt-2 text-center'>
              Connect with fellow students and improve your academic
              performance.
            </p>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className='w-1/2 flex flex-col justify-center items-center p-8'>
          {children}
        </div>
      </div>
    </main>
  );
}

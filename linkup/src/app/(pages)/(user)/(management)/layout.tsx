import React from 'react';
import Image from 'next/image';

// Add the similar left hand side of login/sign up and make sure the form is to the right of it
export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <main className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Left Panel */}
        {/* logo */}
        <div className="hidden md:flex flex-col justify-between bg-blue-950 text-white p-8 w-1/2">
          <div className="mb-8">
            <Image src="/signin_logo.png" alt="Logo" width={80} height={80} />
          </div>
          {/* image */}
          <div className="text-center flex flex-col items-center">
            <Image src="/library.png" alt="Library" width={3000} height={300} className="mb-4" />
            {/* text */}
            <h2 className="text-xl font-semibold text-center">Find your perfect study partners</h2>
            <p className="text-sm mt-2 text-center">
              Connect with fellow students and improve your academic performance.
            </p>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-1/2 p-8">
          {children}
        </div>
      </div>
    </main>
  );
}

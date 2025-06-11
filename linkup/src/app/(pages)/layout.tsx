import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from './_components/navbar/navbar';
import Footer from './_components/footer/footer';
import { AuthContextProvider } from './_contexts/AuthContext';
import '@/app/globals.css';

// use layout to incorporate Auth Context
/* Check if user is logged in
  - if so, fetch data from firestore on users & sessions and pass as prop to children
  - if not, pass in null data as a prop to children.
*/

export const metadata: Metadata = {
  title: 'LinkUp',
  description: 'A platform for those wanting to form study groups!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AuthContextProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}

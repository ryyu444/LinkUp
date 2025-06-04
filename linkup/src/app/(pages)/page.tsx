'use client';
import { useEffect, useContext } from 'react';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from './_contexts/AuthContext';
import Example from './_components/example/example';
import User from '../_types/auth/User';
import Navbar from './_components/navbar/navbar'; 
import Image from 'next/image';

async function testDB() {
  const db = getFirebaseDB();

  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const userList: User[] = usersSnapshot.docs.map((user) => {
    const data = user.data();
    const username = data.username;
    const password = data.password;
    const accessToken = user.id;

    return { username, password, accessToken };
  });

  console.log(usersCol);
  console.log(usersSnapshot);
  console.log(userList);
}

let title = 'WOO';
// Note: Components are simply written with HTML tag syntax whether the name of the component is the tag name
// You can also pass in props and have your component take them in (e.g title)

/*
  Corresponds to About Page (though it really is just a home page)
  1. Implement Hero & other details about our features.
*/
export default function Home() {
  useEffect(() => {
    testDB();
    return;
  }, []);

  // check to see if auth context is being passed down to children properly
  const auth = useContext(AuthContext);
  console.log(auth);

  // the about page
  return (
    //the page background: full vertical height, white background, dark text
    <main className="min-h-screen bg-white text-gray-900">
      {/* the navbar section */}
      {/* <Navbar /> */}

      {/* the intro Section */}
      {/* 1 column on mobile device, 2 column on the ewst, even space, padding all around*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10">
        <div>
          {/* the text */}
          <h1 className="text-5xl font-bold text-blue-950 mb-4">Find Your Perfect Study Buddy</h1>
          {/* left column, black collor */}
          <p className="text-2xl text-gray-900">
            <strong>LinkUp connects university students for collaborative study sessions. Find partners who match your learning style, subject interests, and schedule. </strong>
          </p>
        </div>
        {/* the image from src and in the right column  */}
        <div className="flex justify-center">
          <Image src="/library.png" alt="Library Scene" width={500} height={500} />
        </div>
      </section>

      {/* Features Section */}
      {/* the background setting */}
      <section className="bg-blue-50 py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white shadow-md rounded p-6">
          {/* the create study sessions */}
          <div className="mb-4">
            <Image src="/logo_CreateStudySessions.png" alt="Create Study Sessuins Logo" width={40} height={40} />
          </div>
          <h3 className="font-semibold text-lg">Create Study Sessions</h3>
          <p className="text-sm text-gray-700">Schedule study sessions for any subject and invite others to join.</p>
        </div>
        {/* the find sessions */}
        <div className="bg-white shadow-md rounded p-6">
          <div className="mb-4">
            <Image src="/logo_FindStudySection.png" alt="Find Sessions Logo" width={40} height={40} />
          </div>
          <h3 className="font-semibold text-lg">Find Sessions</h3>
          <p className="text-sm text-gray-700">Browse and filter study sessions based on subject, location, and time.</p>
        </div>
        {/* tge connect with peers */}
        <div className="bg-white shadow-md rounded p-6">
          <div className="mb-4">
            <Image src="/logo_ConnectWithPeers.png" alt="Connect With Peers Logo" width={40} height={40} />
          </div>
          <h3 className="font-semibold text-lg">Connect With Peers</h3>
          <p className="text-sm text-gray-700">Meet students with similar academic interests and learning styles.</p>
        </div>
      </section>
    </main>
  );
}

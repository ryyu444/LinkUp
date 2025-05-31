'use client';
import { useEffect, useContext } from 'react';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from './_contexts/AuthContext';
import Example from './_components/example/example';
import User from '../_types/auth/User';

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

  return (
    <div>
      Hello world!
      <Example title={title} />
    </div>
  );
}

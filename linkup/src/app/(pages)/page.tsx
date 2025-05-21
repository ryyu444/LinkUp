'use client';
import { useEffect } from 'react';
import { getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import Example from './_components/example/example';
import User from '../_types/auth/User';

async function testDB() {
  const db = getFirebaseDB();

  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const userList: User[] = usersSnapshot.docs.map((user) => {
    const data = user.data();
    const id = user.id;
    const username = data.username;
    const password = data.password;

    return { id, username, password };
  });

  console.log(usersCol);
  console.log(usersSnapshot);
  console.log(userList);
}

let title = 'WOO';
// Note: Components are simply written with HTML tag syntax whether the name of the component is the tag name
// You can also pass in props and have your component take them in (e.g title)
export default function Home() {
  useEffect(() => {
    testDB();
    return;
  }, []);

  return (
    <div>
      Hello world!
      <Example title={title} />
    </div>
  );
}

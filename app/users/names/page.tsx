import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const UserPages = async () => {
  // Prilagodi URL na tvoju lokalnu API rutu
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  const users: User[] = await res.json();
  
  return (
    <>
      <h1>Users names:</h1>
      <ul>
        {users.map(user => <li key={user.id}>{user.name} , {user.age} </li>)}
      </ul>
    </>
  );
}

export default UserPages;

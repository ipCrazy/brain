"use client";

interface User {
  name: string;
  email: string;
}

export default function Header({ user }: { user: User }) {
  return (
    <div>
      <h1>Dobro dosli {user.name}!</h1>
      <p>email : {user.email}</p>
    </div>
  );
}

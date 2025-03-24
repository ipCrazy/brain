"use client";

interface User {
  name: string;
  email: string;
}

export default function Dashboard({ user }: { user: User }) {
  return (
    <div className="dashboard">
      <h1>Dobro dosli {user.name}!</h1>
      <p>email : {user.email}</p>
    </div>
  );
}

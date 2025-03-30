"use client";

import { ModeToggle } from "@/components/ModeToggle";

interface User {
  name: string;
  email: string;
}

export default function Header({ user }: { user: User }) {
  return (
    <div>
      <ModeToggle />
      <h1>Dobro dosliiii {user.name}!</h1>
      <p>email : {user.email}</p>
    </div>
  );
}

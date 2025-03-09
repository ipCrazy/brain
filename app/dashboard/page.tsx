'use client'
// Example: Fetching user data in a React component
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
   
  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data: User) => {
        console.log("User data from API:", data); // Debug: Log the fetched user data
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error); // Debug: Log any errors
      });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
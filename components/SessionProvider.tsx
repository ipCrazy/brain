"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  email: string;
  name: string;
};

const SessionContext = createContext<{ user: User | null }>({ user: null });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useUserSession() {
  return useContext(SessionContext);
}

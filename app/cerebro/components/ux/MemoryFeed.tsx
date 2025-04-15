"use client";

import { useEffect, useState } from "react";
import { useMemoryStore } from "../../stores/memoryStore";
import { useUserSession } from "@/components/SessionProvider";

export default function MemoryFeed() {
  const { user } = useUserSession();
  const [memories, setMemories] = useState([]);
  const { shouldRefetch, clearRefetch } = useMemoryStore();

  const fetchMemories = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/memory?date=${today}`);
    const data = await res.json();
    setMemories(data.memories);
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  useEffect(() => {
    if (shouldRefetch) {
      fetchMemories();
      clearRefetch();
    }
  }, [shouldRefetch]);

  return (
    <div
      className="bg-blue-300 flex flex-col w-full max-w-3xl gap-3 overflow-y-auto pr-2"
      style={{ maxHeight: "calc(100vh - 140px)" }} // prilagodi visinu inputa
    >
      {memories.map((m: any) => (
        <div key={m._id} className="bg-white/10 p-3 rounded-xl text-white">
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}

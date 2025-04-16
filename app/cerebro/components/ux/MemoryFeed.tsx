"use client";

import { useEffect, useRef, useState } from "react";
import { useMemoryStore } from "../../stores/memoryStore";

type Memory = { _id: string; content: string };

export default function MemoryFeed({
  initialMemories,
}: {
  initialMemories: Memory[];
}) {
  const [memories, setMemories] = useState(initialMemories);
  const { shouldRefetch, clearRefetch } = useMemoryStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMemories = async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/memory?date=${today}`);
    const data = await res.json();
    setMemories(data.memories);
  };

  useEffect(() => {
    if (shouldRefetch) {
      fetchMemories();
      clearRefetch();
    }
  }, [shouldRefetch]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [memories]);

  return (
    <div className="flex flex-col gap-3">
      {memories.map((m) => (
        <div key={m._id} className=" p-3 rounded-xl text-white">
          <p className="break-words break-word w-full text-pre-wrap">
            {m.content}
          </p>
          <hr className="my-2 border-gray-500" />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

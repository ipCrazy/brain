"use client";

import { useEffect, useRef, useState } from "react";
import { useMemoryStore } from "../../stores/memoryStore";
import MemoryCard from "./MemoryCard";

type Memory = {
  _id: string;
  content: string;
};

export default function MemoryFeed({
  initialMemories,
}: {
  initialMemories: Memory[];
}) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const { shouldRefetch, clearRefetch } = useMemoryStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMemories = async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/memory?date=${today}`);
    const data = await res.json();
    setMemories(data.memories);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/memory`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMemories();
  };

  const handleUpdate = async (id: string, newContent: string) => {
    await fetch(`/api/memory`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: newContent }),
    });
    fetchMemories();
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
        <MemoryCard
          key={m._id}
          memory={m}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

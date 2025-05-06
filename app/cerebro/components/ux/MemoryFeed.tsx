"use client";

import { useEffect, useRef, useState } from "react";
import { useMemoryStore } from "../../stores/memoryStore";
import MemoryCard from "./MemoryCard";

type Memory = {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function MemoryFeed({
  initialMemories,
}: {
  initialMemories: Memory[];
}) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [openedCardId, setOpenedCardId] = useState<string | null>(null);
  const { shouldRefetch, clearRefetch } = useMemoryStore();
  const feedRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        feedRef.current &&
        !feedRef.current.contains(e.target as Node) &&
        openedCardId
      ) {
        setOpenedCardId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openedCardId]);

  // Auto-close after 10 seconds
  useEffect(() => {
    if (openedCardId) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpenedCardId(null);
      }, 10000); // 10 sekundi
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [openedCardId]);

  useEffect(() => {
    if (shouldRefetch) {
      fetchMemories();
      clearRefetch();
    }
  }, [shouldRefetch]);

  return (
    <div className="flex flex-col gap-3" ref={feedRef}>
      {memories.map((m) => (
        <MemoryCard
          key={m._id}
          memory={m}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          isOpen={openedCardId === m._id}
          onToggle={() =>
            setOpenedCardId((prev) => (prev === m._id ? null : m._id))
          }
        />
      ))}
    </div>
  );
}

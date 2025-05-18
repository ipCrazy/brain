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

  // 👇 Dodato: Ref na poslednju memoriju
  const lastMemoryRef = useRef<HTMLDivElement | null>(null);

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

  // 👇 Dodato: Automatski scroll na poslednju memoriju kada se lista ažurira
  useEffect(() => {
    if (lastMemoryRef.current) {
      lastMemoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [memories]);

  // Click outside da zatvori otvorenu karticu
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

  // Auto zatvaranje nakon 10 sekundi
  useEffect(() => {
    if (openedCardId) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpenedCardId(null);
      }, 10000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [openedCardId]);

  // Re-fetch memorija ako je zatraženo
  useEffect(() => {
    if (shouldRefetch) {
      fetchMemories();
      clearRefetch();
    }
  }, [shouldRefetch]);

  return (
    <div className="flex  flex-col" ref={feedRef}>
      {memories.map((m, index) => {
        const isLast = index === memories.length - 1;
        return (
          <div key={m._id} ref={isLast ? lastMemoryRef : null}>
            <MemoryCard
              memory={m}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isOpen={openedCardId === m._id}
              onToggle={() =>
                setOpenedCardId((prev) => (prev === m._id ? null : m._id))
              }
              isFirst={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}

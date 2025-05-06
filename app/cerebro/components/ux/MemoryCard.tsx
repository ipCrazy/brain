"use client";

import { useEffect, useState } from "react";

type Memory = {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  memory: Memory;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export default function MemoryCard({
  memory,
  onDelete,
  onUpdate,
  isOpen,
  onToggle,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");

  useEffect(() => {
    if (memory?.content) {
      setEditedContent(memory.content);
    }
  }, [memory]);

  const handleSave = () => {
    if (!editedContent.trim()) return;
    onUpdate(memory._id, editedContent.trim());
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Da li ste sigurni da želite da obrišete ovu memoriju?")) {
      onDelete(memory._id);
    }
  };

  return (
    <div
      onClick={() => !isEditing && onToggle()}
      className="bg-white/10 p-4 rounded-xl text-white relative cursor-pointer transition duration-200 active:scale-[0.99]"
    >
      {isEditing ? (
        <>
          <textarea
            className="w-full bg-transparent border border-gray-500 p-2 rounded text-white resize-none"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="text-green-400 hover:text-green-300 font-semibold"
            >
              Sačuvaj
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="text-gray-400 hover:text-gray-300 font-semibold"
            >
              Otkaži
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="break-words whitespace-pre-wrap">{memory.content}</p>
          <div className="mt-2 text-sm text-gray-400">
            <div>
              Uneto:{" "}
              {new Date(memory.createdAt).toLocaleString("sr-RS", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
            {memory.updatedAt !== memory.createdAt && (
              <div>
                Izmenjeno:{" "}
                {new Date(memory.updatedAt).toLocaleString("sr-RS", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
            )}
          </div>

          {isOpen && (
            <div className="mt-3 flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Izmeni
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Obriši
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

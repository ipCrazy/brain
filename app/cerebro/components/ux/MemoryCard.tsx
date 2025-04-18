"use client";

import { useEffect, useState } from "react";

type Memory = {
  _id: string;
  content: string;
};

type Props = {
  memory: Memory;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
};

export default function MemoryCard({ memory, onDelete, onUpdate }: Props) {
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
    <div className="bg-white/10 p-4 rounded-xl text-white relative group">
      {isEditing ? (
        <textarea
          className="w-full bg-transparent border border-gray-500 p-2 rounded text-white resize-none"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="break-words whitespace-pre-wrap">{memory.content}</p>
      )}

      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            Sačuvaj
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Izmeni
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 font-semibold"
        >
          Obriši
        </button>
      </div>
    </div>
  );
}

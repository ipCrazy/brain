// components/MemoryCard.tsx
'use client';

import { useEffect, useState } from 'react';
import FormattedDate from '@/components/FormattedDate';

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
  isFirst: boolean;
};

export default function MemoryCard({
  memory,
  onDelete,
  onUpdate,
  isOpen,
  onToggle,
  isFirst,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (memory?.content) {
      setEditedContent(memory.content);
    }
  }, [memory]);

  const handleSave = () => {
    const trimmed = editedContent.trim();
    if (!trimmed || trimmed === memory.content.trim()) {
      setIsEditing(false);
      return;
    }
    onUpdate(memory._id, trimmed);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure that you want to delete this memory?')) {
      onDelete(memory._id);
    }
  };

  return (
    <div
      onClick={() => !isEditing && onToggle()}
      className="rounded-xl relative cursor-pointer transition duration-200 active:scale-[0.99]"
    >
      {!isFirst && <hr className="my-4 border-gray-500 border-opacity-15" />}
      {isEditing ? (
        <>
          <textarea
            className="w-full bg-transparent border border-gray-500 p-2 rounded resize-none"
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
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="text-gray-400 hover:text-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="break-words whitespace-pre-wrap">{memory.content}</p>

          <div className="mt-2 text-sm text-gray-400">
            <div>
              Date: <FormattedDate timestamp={memory.createdAt} />
            </div>
            {memory.updatedAt !== memory.createdAt &&
              new Date(memory.updatedAt).getTime() !==
                new Date(memory.createdAt).getTime() && (
                <div>
                  Edited: <FormattedDate timestamp={memory.updatedAt} />
                </div>
              )}
          </div>

          <div
            className={`mt-3 flex gap-4 transition-opacity duration-300 ${
              isOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useMemoryStore } from "../../stores/memoryStore";

export default function AppInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const { triggerRefetch } = useMemoryStore();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    setMessage(textarea.value);
    textarea.style.height = "44px";

    const maxHeight = 300;
    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isSubmitting) {
      event.preventDefault();
      inputRef.current?.form?.requestSubmit();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.trim() }),
      });

      if (res.ok) {
        triggerRefetch();
      } else {
        const data = await res.json();
        console.error("Greška:", data.error);
      }
    } catch (err) {
      console.error("Fetch greška:", err);
    } finally {
      setIsSubmitting(false);
    }

    setMessage("");
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      inputRef.current.blur();
    }
  };

  if (pathname === "/cerebro/settings") return null;

  return (
    <div className="w-full">
      <div
        className="flex w-full flex-col items-center justify-center max-w-3xl mx-auto cursor-text px-4"
        onClick={() => inputRef.current?.focus()}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm border dark:border-white/20 shadow-md w-full rounded-3xl flex flex-col items-center justify-between px-3 py-2.5"
        >
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message"
            rows={1}
            disabled={isSubmitting}
            className="bg-transparent text-white placeholder:text-gray-400 px-3 py-2 outline-none w-full resize-none overflow-auto"
            style={{
              minHeight: "44px",
              maxHeight: "300px",
              whiteSpace: "pre-wrap",
            }}
          />

          <div className="flex w-full flex-row items-center justify-between mt-2">
            <div className="flex flex-row items-center gap-3 pl-1">
              <p>icon1</p>
              <p>icon2</p>
              <p>icon3</p>
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className={`rounded-full transition h-11 w-11 mr-1 flex items-center justify-center ${
                message.trim() && !isSubmitting
                  ? "bg-black/40 hover:bg-black/60"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              style={{
                pointerEvents:
                  message.trim() && !isSubmitting ? "auto" : "none",
              }}
            >
              <LuBrainCircuit className="text-white text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";

import { usePathname } from "next/navigation";

export default function AppInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    setMessage(textarea.value);

    textarea.style.height = "44px";

    const maxHeight = 300;

    if (textarea.scrollHeight > textarea.clientHeight) {
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (inputRef.current) {
        inputRef.current.form?.requestSubmit();
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Sprečava ponovno učitavanje stranice
    console.log("Message Sent:", message);
    setMessage(""); // Resetuje sadržaj poruke

    // Resetovanje visine textarea
    if (inputRef.current) {
      inputRef.current.style.height = "44px"; // Resetuje visinu textarea
      inputRef.current.blur(); // Uklanja fokus sa textarea i zatvara tastaturu
    }
  };

  if (pathname === "/cerebro/settings") {
    return null;
  }
  return (
    <div className="fixed bottom-0 w-full pb-4">
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
              className={`rounded-full transition h-11 w-11 mr-1 flex items-center justify-center ${
                message
                  ? "bg-black/40 hover:bg-black/60"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!message}
              style={{ pointerEvents: message ? "auto" : "none" }}
            >
              <LuBrainCircuit className="text-white text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

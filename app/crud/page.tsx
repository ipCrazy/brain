"use client";

import { useState } from "react";

export default function CreatePage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // State za greške

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setError(null); // Clear previous errors

    if (age === "" || isNaN(Number(age))) {
      setError("Invalid age. Please enter a number.");
      return;
    }

    try {
      const response = await fetch("/api/sest/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, age: Number(age) }),
      });

      if (!response.ok) { // Check for HTTP errors (4xx or 5xx)
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      const result = await response.json();
      setMessage(result.message);
      setName(""); // Reset form fields
      setEmail("");
      setAge("");
    } catch (err: any) { // Type 'any' for error, as it can be various types
        console.error("Error submitting form:", err);
      if (err.message) {
        setError(err.message); // Set error message from the caught error
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div> {/* Ovo je dodato da bi se izbegla potencijalna greška sa fragmentima */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="number"
          value={age === "" ? "" : age.toString()}
          onChange={(e) => setAge(e.target.value === "" ? "" : parseInt(e.target.value))}
          placeholder="Age"
          required
        />
        <button type="submit">Submit</button>
        {message && <p style={{ color: "green" }}>{message}</p>} {/* Prikaz poruke o uspehu */}
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Prikaz poruke o grešci */}
      </form>
    </div>
  );
}
"use client"; // Add this directive to make the file a client component

import React, { useState } from "react";

const AddUser = () => {
  const [name, setName] = useState("");
  const [surrName, setSurrName] = useState("");
  const [age, setAge] = useState("");

  const handleAddUser = async () => {
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surrName, age: Number(age) }),
      });

      if (res.ok) {
        alert("User added successfully!");
        setName("");
        setSurrName("");
        setAge("");
      } else {
        alert("Error adding user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Surname"
        value={surrName}
        onChange={(e) => setSurrName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default AddUser;

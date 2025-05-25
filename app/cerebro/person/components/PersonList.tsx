"use client";

import { useEffect, useState } from "react";

export default function PersonList() {
  const [persons, setPersons] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/person")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dobijeni podaci:", data);
        setPersons(data.people || []);
      });
  }, []);

  return (
    <div className="space-y-4">
      {persons.length === 0 && <p>Nema poznatih osoba još uvek.</p>}
      {persons.map((person) => (
        <div
          key={person._id}
          className="border p-4 rounded-lg bg-white dark:bg-neutral-900 shadow"
        >
          <div className="font-semibold">
            {person.name} {person.surname}
          </div>
          {person.email && (
            <div className="text-sm text-neutral-500">{person.email}</div>
          )}
        </div>
      ))}
    </div>
  );
}

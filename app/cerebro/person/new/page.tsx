"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CustomField = {
  key: string;
  value: string;
};

export default function NewPersonPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    nickname: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    relationship: "",
    occupation: "",
    company: "",
    notes: "",
  });

  function normalizeKey(input: string): string {
    if (!input) return "";

    // Ukloni praznine sa početka i kraja
    let trimmed = input.trim();

    // Zameni sve uzastopne razmake sa jednim razmakom
    // Regex: \s+ znači jedan ili više whitespace karaktera
    trimmed = trimmed.replace(/\s+/g, " ");

    return trimmed;
  }

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customObject = Object.fromEntries(
      customFields
        .filter((f) => f.key.trim() !== "") // filtiraj prazne ključeve
        .map(({ key, value }) => [normalizeKey(key), value]) // normalizuj ključeve
    );

    const payload = {
      ...formData,
      customFields: customObject,
    };

    try {
      const res = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/cerebro/person");
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("Greška prilikom slanja:", errorData);
        } else {
          const errorText = await res.text();
          console.error("Greška prilikom slanja:", errorText);
        }
      }
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">➕ Add New Person</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <FloatingInput
            key={key}
            name={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={handleInputChange}
            type={
              key === "age"
                ? "number"
                : key === "email"
                ? "email"
                : key === "birthday"
                ? "date"
                : "text"
            }
            isTextarea={key === "notes"}
          />
        ))}

        <div className="border-t pt-4">
          <h2 className="font-medium text-lg mb-2">🔧 Custom Fields</h2>
          {customFields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <div className="relative w-1/3">
                <input
                  type="text"
                  placeholder=" "
                  value={field.key}
                  onChange={(e) =>
                    handleCustomChange(index, "key", e.target.value)
                  }
                  className="peer w-full px-3 pt-5 pb-2 border rounded-md dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  autoComplete="off"
                />
                <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black dark:peer-focus:text-white">
                  Key
                </label>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder=" "
                  value={field.value}
                  onChange={(e) =>
                    handleCustomChange(index, "value", e.target.value)
                  }
                  className="peer w-full px-3 pt-5 pb-2 border rounded-md dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  autoComplete="off"
                />
                <label className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black dark:peer-focus:text-white">
                  Value
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeCustomField(index)}
                className="text-red-600 hover:underline"
              >
                ✖
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomField}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            ➕ Add Custom Field
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-black text-white hover:bg-neutral-800"
        >
          Save Person
        </button>
      </form>
    </div>
  );
}

// FloatingInput component
function FloatingInput({
  name,
  label,
  value,
  onChange,
  type = "text",
  isTextarea = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  isTextarea?: boolean;
}) {
  return (
    <div className="relative w-full">
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
          rows={4}
          autoComplete="off"
          className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      )}
      <label
        htmlFor={name}
        className="absolute left-3 top-1 text-sm text-gray-500 dark:text-gray-400 transition-all transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black dark:peer-focus:text-white peer-focus:scale-100"
      >
        {label}
      </label>
    </div>
  );
}

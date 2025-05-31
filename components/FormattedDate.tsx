"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
  timestamp: string;
}

export default function FormattedDate({ timestamp }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date(timestamp);
    setFormattedDate(
      date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [timestamp]);

  return <span>{formattedDate}</span>;
}

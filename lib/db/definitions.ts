// lib/db/definitions.ts
import { ObjectId } from "mongodb";

export interface PersonType {
  _id: ObjectId;
  userId: ObjectId | null;
  name: string;
  surname: string;
  age: number;
  birthday: Date | null; // ✅ Dozvoli null
  updatedAt: Date;
  createdAt: Date;
}

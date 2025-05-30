// lib/db/fetchPersons.ts
import Person from "@/models/Person";
import { Types } from "mongoose";

interface IPerson {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  surname: string;
  age?: number;
  birthday?: Date | null;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;
  occupation?: string;
  company?: string;
  notes?: string;
  customFields?: Record<string, any>;
  updatedAt: Date;
  createdAt: Date;
  __v?: number;
}

export interface PersonType {
  _id: string;
  userId: string | null;
  name: string;
  surname: string;
  age?: number;
  nickname?: string;
  birthday?: string | null;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;
  occupation?: string;
  company?: string;
  notes?: string;
  customFields?: Record<string, string>;
  updatedAt: string;
  createdAt: string;
}

export async function getPersonsForUser(userId: string): Promise<PersonType[]> {
  const persons = await Person.find({ userId })
    .sort({ createdAt: -1 })
    .lean<IPerson[]>()
    .exec();

  return persons.map((person) => {
    const processedCustomFields: Record<string, string> = {};

    if (person.customFields) {
      for (const key in person.customFields) {
        if (Object.prototype.hasOwnProperty.call(person.customFields, key)) {
          processedCustomFields[key] = String(person.customFields[key]);
        }
      }
    }

    return {
      _id: person._id.toString(),
      userId: person.userId?.toString() ?? null,
      name: person.name,
      surname: person.surname,
      age: person.age,
      birthday: person.birthday?.toISOString() ?? null,
      email: person.email ?? "",
      phone: person.phone ?? "",
      address: person.address ?? "",
      relationship: person.relationship ?? "",
      occupation: person.occupation ?? "",
      company: person.company ?? "",
      notes: person.notes ?? "",
      customFields: processedCustomFields,
      updatedAt: person.updatedAt.toISOString(),
      createdAt: person.createdAt.toISOString(),
    };
  });
}

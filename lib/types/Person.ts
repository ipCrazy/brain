export type PersonType = {
  _id: string;
  userId?: string;
  name: string;
  surname: string;
  nickname?: string;
  age?: number;
  birthday?: string | null;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  occupation?: string;
  relationship?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  customFields?: Record<string, string>;
};

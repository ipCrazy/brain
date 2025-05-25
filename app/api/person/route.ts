import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongo";
import { verifyToken } from "@/utils/jwt";
import Person from "@/models/Person";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { userId } = decoded as { userId: string };

  const data = await req.json();
  const {
    name,
    surname,
    nickname,
    age,
    gender,
    email,
    phone,
    address,
    birthday,
    relationship,
    occupation,
    company,
    notes,
    customFields,
    tags,
  } = data;

  const newPerson = new Person({
    userId,
    name,
    surname,
    nickname,
    age,
    gender,
    email,
    phone,
    address,
    birthday,
    relationship,
    occupation,
    company,
    notes,
    customFields,
    tags,
  });

  await newPerson.save();

  return NextResponse.json({ success: true, person: newPerson });
}

export async function GET() {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { userId } = decoded as { userId: string };

  const people = await Person.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json({ people });
}

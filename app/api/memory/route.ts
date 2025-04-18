import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongo";
import { verifyToken } from "@/utils/jwt";
import UserMemory from "@/models/UserMemory";

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

  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const newMemory = new UserMemory({
    userId,
    content: text,
  });

  await newMemory.save();

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { userId } = decoded as { userId: string };

  const dateParam = req.nextUrl.searchParams.get("date");
  if (!dateParam)
    return NextResponse.json({ error: "Date is required" }, { status: 400 });

  // Normalize date
  const startOfDay = new Date(dateParam + "T00:00:00.000Z");
  const endOfDay = new Date(dateParam + "T23:59:59.999Z");

  const memories = await UserMemory.find({
    userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ createdAt: 1 });

  return NextResponse.json({ memories });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { userId } = decoded as { userId: string };
  const { id, text } = await req.json();

  if (!id || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const memory = await UserMemory.findOneAndUpdate(
    { _id: id, userId },
    { content: text },
    { new: true }
  );

  if (!memory) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, memory });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { userId } = decoded as { userId: string };
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing memory ID" }, { status: 400 });
  }

  const result = await UserMemory.findOneAndDelete({ _id: id, userId });

  if (!result) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

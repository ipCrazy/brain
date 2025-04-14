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

// /app/api/me/route.ts
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { getUserById } from "@/models/User";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";

export async function GET() {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ user: null }, { status: 401 });

  const user = await getUserById((decoded as { userId: string }).userId);

  return NextResponse.json(user ? { user } : { user: null }, {
    status: user ? 200 : 401,
  });
}

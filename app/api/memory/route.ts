import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo"; // tvoja konekcija
import { getServerSession } from "next-auth"; // ako koristiš auth
import { authOptions } from "@/lib/auth"; // tvoj auth setup

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid text input" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // koristi bazu iz URI-ja (npr. TESTIRAMO)
    const collection = db.collection("memories");

    const result = await collection.insertOne({
      userId: session.user.email,
      text,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error inserting memory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

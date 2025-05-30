import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongo";
import { verifyToken } from "@/utils/jwt";
import Person from "@/models/Person";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Izvuci token iz kolačića i validiraj korisnika
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { userId } = decoded as { userId: string };

    const body = await req.json();
    const {
      name,
      surname,
      // ... ostala fiksna polja
      customFields,
    } = body;

    if (!name || !surname) {
      return NextResponse.json(
        { message: "Ime i prezime su obavezni." },
        { status: 400 }
      );
    }

    if (customFields && typeof customFields !== "object") {
      return NextResponse.json(
        { message: "Custom fields moraju biti objekat." },
        { status: 400 }
      );
    }

    const newPerson = new Person({
      userId, // POVEŽI osobu sa korisnikom
      name,
      surname,
      // ... dodaj ostala fiksna polja ako ih ima
      customFields: customFields || {}, // default prazan objekat
    });

    await newPerson.save();

    return NextResponse.json(
      { success: true, person: newPerson },
      { status: 200 }
    );
  } catch (error) {
    console.error("Greška u API handleru:", error);
    return NextResponse.json(
      { message: "Greška servera", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { userId } = decoded as { userId: string };

    const people = await Person.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ people });
  } catch (error) {
    console.error("Greška u GET /api/person:", error);
    return NextResponse.json(
      { message: "Greška servera", error: String(error) },
      { status: 500 }
    );
  }
}

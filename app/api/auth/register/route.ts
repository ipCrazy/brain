import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import connectToDatabase from "@/lib/mongo";
import { z } from "zod";
import UserMemory from "@/models/UserMemory"; // Import modela

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
  confirmPassword: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Proverava da li se lozinke poklapaju
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validacija ulaznih podataka
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Povezivanje sa bazom

    // Proverava da li već postoji korisnik sa istim emailom
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Kreira novog korisnika
    const newUser = new UserModel({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    await newUser.save(); // Spasi novog korisnika u bazu

    // Dodaj prvu memoriju u `user_memory` kolekciju
    const newMemory = new UserMemory({
      userId: newUser._id, // ID korisnika
      content: "Dobrodošli! Ovo je vaša prva memorija.", // Prva memorija
    });

    await newMemory.save(); // Spasi memoriju u bazu

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

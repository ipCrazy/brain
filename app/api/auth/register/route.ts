import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongo';
import { z } from 'zod';

// Definišemo Zod šemu za validaciju
const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  email: z.string().email('Invalid email format.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export async function POST(request: Request) {
  try {
    // Parsiranje podataka iz zahteva
    const body = await request.json();

    // Validacija pomoću Zod šeme
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues.map((issue) => issue.message) },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Povezivanje sa bazom podataka
    await connectToDatabase();

    // Proveravamo da li korisnik već postoji
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Heširanje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kreiranje novog korisnika
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    // Snimanje korisnika u bazu
    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

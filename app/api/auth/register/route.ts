// app/api/register/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongo';
import UserModel from '@/models/User';
import UserMemory from '@/models/UserMemory';

const userSchema = z
  .object({
    name: z.string().min(3, 'Ime mora imati najmanje 3 karaktera'),
    email: z.string().email('Nevažeća email adresa'),
    password: z
      .string()
      .min(8, 'Lozinka mora imati najmanje 8 karaktera')
      .regex(/[A-Z]/, 'Lozinka mora sadržati najmanje jedno veliko slovo')
      .regex(/[0-9]/, 'Lozinka mora sadržati najmanje jedan broj')
      .regex(/[^a-zA-Z0-9]/, 'Lozinka mora sadržati najmanje jedan specijalni karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validacija ulaznih podataka
    const result = userSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Nevažeći podaci';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // Povezivanje sa bazom
    await connectToDatabase();

    // Provera da li korisnik već postoji
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Korisnik već postoji' }, { status: 400 });
    }

    // Hesiranje lozinke
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kreiranje novog korisnika
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Dodavanje prve memorije korisniku
    const newMemory = new UserMemory({
      userId: newUser._id,
      content: 'Dobrodošli! Ovo je vaša prva memorija.',
    });

    await newMemory.save();

    return NextResponse.json({ message: 'Registracija uspešna' }, { status: 201 });
  } catch (error) {
    console.error('Greška prilikom registracije:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}

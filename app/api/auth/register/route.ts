import { NextResponse } from 'next/server';
import UserModel from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongo';
import { z } from 'zod';

// Define Zod schema for validation
const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod schema
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = body;

    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email }).select('_id');
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password, // Raw password; hashing is handled by Mongoose middleware
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';
import connectToDatabase from '@/lib/mongo';
import { generateToken } from '@/utils/jwt'; // Assuming you have a JWT generation function

export async function POST(request: Request) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const body = await request.json();
    const { email, password } = body;

    // Validate email and password
    if (!email || !password) {
      console.log('Missing email or password:', { email, password });
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ email }).select('password'); 
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    // Debugging logs: print the password from client and stored hash
    console.log('Password from client:', password);
    console.log('Password hash from database:', user.password);

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    // Generate token (replace with your implementation)
    let token;
    try {
      token = generateToken(user._id); 
      console.log('Generated token for user:', email, 'Token:', token);
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to generate authentication token.' },
        { status: 500 }
      );
    }

    // Login successful
    console.log('Login successful for user:', email);
    return NextResponse.json(
      { message: 'Login successful.', token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

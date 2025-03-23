import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';
import connectToDatabase from '@/lib/mongo';
import { generateToken } from '@/utils/jwt';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const token = generateToken(user._id);

    const response = NextResponse.json(
      { message: 'Login successful.' },
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      `auth-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      } SameSite=Strict;`
    );

    return response;
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

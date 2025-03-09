import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { getUserById } from '@/models/User';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongo';

export async function GET() {
  try {
    // Ensure the database is connected
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }

    const user = await getUserById((decoded as { userId: string }).userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
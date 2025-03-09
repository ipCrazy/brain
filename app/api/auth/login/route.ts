import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import connectToDatabase from "@/lib/mongo";
import { generateToken } from "@/utils/jwt"; // Assuming you have a JWT generation function

export async function POST(request: Request) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const { email, password } = await request.json();

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ email }).select("password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    // Generate token
    const token = generateToken(user._id); // Assume this creates a valid JWT token
    console.log("Token:", token);
    // Set token in cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures HTTPS in production
      maxAge: 60 * 60 * 24 * 31, // 1 month in seconds
      path: "/", // Makes the cookie available across the entire app
    });

    return NextResponse.json(
      { message: "Login successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
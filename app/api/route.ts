import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb"; // Ensure your connection logic is correct

// Handle GET requests
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const users = await db.collection("myCollection").find().toArray();

    return NextResponse.json(users); // Return users as JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.error(); // Return error response
  }
}

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();

    // Parse the JSON body from the request
    const { name, surrName, age } = await request.json();

    // Validate the incoming data
    if (!name || !age) {
      return NextResponse.json(
        { error: "Name and age are required!" },
        { status: 400 }
      );
    }

    // Insert data into the collection
    const result = await db.collection("myCollection").insertOne({
      name,
      surrName,
      age,
    });

    return NextResponse.json(
      { message: "User added successfully!", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the user." },
      { status: 500 }
    );
  }
}

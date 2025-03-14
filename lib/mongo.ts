import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || ""; // Ensure this is defined in your .env file

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// Enable Mongoose debugging (optional)
mongoose.set("debug", true);

// Cache the connection to avoid reconnecting unnecessarily
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
  // If a connection already exists and is connected, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return cachedConnection;
  }

  try {
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    const connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
    });

    console.log("Successfully connected to MongoDB");

    // Cache the connection
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    // Clear the cached connection
    cachedConnection = null;

    // Throw the error to be handled by the caller
    throw error;
  }
}

export default connectToDatabase;

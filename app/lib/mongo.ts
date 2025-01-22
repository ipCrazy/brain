import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || ''; // Uveri se da imaš ovu promenljivu u .env fajlu

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGO_URI);
}

export default connectToDatabase;

import { MongoClient, Db } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

const uri = process.env.MONGO_URI; // URI za lokalnu MongoDB bazu
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>; // Tip za TypeScript za globalnu promenljivu
}

// Proveri da li već postoji konekcija (važno za razvojni mod da se ne otvara više konekcija)
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Funkcija za dobavljanje baze podataka
export async function connectToDatabase(): Promise<{ db: Db }> {
  const client = await clientPromise;
  const db = client.db(); // Default baza iz URI-ja
  return { db };
}

export default clientPromise;

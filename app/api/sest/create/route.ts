import { NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

async function connectToDatabase(): Promise<Db | NextResponse> {
  try {
    if (!process.env.MONGO_URI) {
    return NextResponse.json({ message: "Konfiguracija baze podataka nije ispravna." }, { status: 500 });
    }
  
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    return client.db("TESTIRAMO");
  } catch (error: any) {
    return NextResponse.json({ message: "Greška pri povezivanju sa bazom podataka." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
  const dbOrResponse = await connectToDatabase();

  if (dbOrResponse instanceof NextResponse) {
    return dbOrResponse;
  }

  const db = dbOrResponse as Db;
  const collection = db.collection("bestCollection");

  const { name, email, age } = await request.json();

  if (!name || !email || !age) {
    return NextResponse.json({ message: "Nedostaju obavezna polja." }, { status: 400 });
  }

  const result = await collection.insertOne({ name, email, age });

  return NextResponse.json({ message: "Podaci su uspešno kreirani.", id: result.insertedId });
  } catch (error) {
  return NextResponse.json({ message: "Greška pri kreiranju podataka." }, { status: 500 });
  }
}

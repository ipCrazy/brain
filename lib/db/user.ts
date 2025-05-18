// lib/db/user.ts
import connectToDatabase from "@/lib/mongo";
import UserModel from "@/models/User";

export async function getUserById(userId: string) {
  await connectToDatabase();
  return await UserModel.findById(userId).lean(); // lean je važno
}

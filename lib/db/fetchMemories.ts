import connectToDatabase from "@/lib/mongo";
import UserMemory from "@/models/UserMemory";

export async function getTodayMemoriesForUser(userId: string) {
  await connectToDatabase();
  const today = new Date().toISOString().split("T")[0];

  const from = new Date(today);
  const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);

  const memories = await UserMemory.find({
    userId,
    createdAt: { $gte: from, $lt: to },
  }).lean();

  return memories as any[];
}

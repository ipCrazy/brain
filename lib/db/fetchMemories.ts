import connectToDatabase from "@/lib/mongo";
import UserMemory from "@/models/UserMemory";
import type { Memory } from "../types/Memory";

export async function getTodayMemoriesForUser(
  userId: string
): Promise<Memory[]> {
  await connectToDatabase();
  const today = new Date().toISOString().split("T")[0];
  const from = new Date(today);
  const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);

  const memories = await UserMemory.find({
    userId,
    createdAt: { $gte: from, $lt: to },
  }).lean();

  return memories.map((memory: any) => ({
    _id: memory._id.toString(),
    userId: memory.userId?.toString() ?? null,
    content: memory.content,
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt?.toISOString(),
  }));
}

import { getUserFromCookies } from "@/lib/auth";
import { getTodayMemoriesForUser } from "@/lib/db/fetchMemories";
import MemoryFeed from "../../app/cerebro/components/ux/MemoryFeed";

export default async function ServerMemoryFeed() {
  const userId = await getUserFromCookies();
  if (!userId) return <div className="text-white">Nema korisnika</div>;

  const memories = await getTodayMemoriesForUser(userId);
  // Convert MongoDB objects to plain JavaScript objects
  const serializedMemories = memories.map((memory) => ({
    ...memory,
    _id: memory._id.toString(), // Convert ObjectId to string
    userId: memory.userId ? memory.userId.toString() : null, // Assuming userId might also be an ObjectId
    // Add any other complex object conversions here
  }));

  return <MemoryFeed initialMemories={serializedMemories} />;
}

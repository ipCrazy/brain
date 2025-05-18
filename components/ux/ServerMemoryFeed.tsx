// components/ServerMemoryFeed.tsx
import { getFullUserFromCookies } from "@/lib/auth";
import { getTodayMemoriesForUser } from "@/lib/db/fetchMemories";
import MemoryFeed from "../../app/cerebro/components/ux/MemoryFeed";

export default async function ServerMemoryFeed() {
  const user = await getFullUserFromCookies();
  if (!user) return <div>Nema korisnika</div>;

  const memories = await getTodayMemoriesForUser(user._id.toString());

  const serializedMemories = memories.map((memory) => ({
    ...memory,
    _id: memory._id.toString(),
    userId: memory.userId?.toString() ?? null,
    updatedAt: memory.updatedAt?.toString() ?? "",
  }));

  return <MemoryFeed initialMemories={serializedMemories} />;
}

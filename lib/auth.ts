import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { getUserById } from "@/lib/db/user";
import type { User } from "@/lib/types/User";

export async function getFullUserFromCookies(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    return null;
  }

  const user = await getUserById(decoded.userId as string);
  if (!user || Array.isArray(user)) return null;

  return {
    _id: (user._id as string).toString(),
    email: user.email,
    name: user.name,
  };
}

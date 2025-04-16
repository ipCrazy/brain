import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return null;

  return decoded.userId as string;
}

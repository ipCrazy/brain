import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { getUserById } from "@/models/User";
import connectToDatabase from "@/lib/mongo";
import Header from "./components/layout/Header";

async function getServerSideUser() {
  await connectToDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await getUserById((decoded as { userId: string }).userId);
  return user ? { name: user.name, email: user.email } : null;
}

export default async function Dashboard() {
  const user = await getServerSideUser();

  if (!user) {
    return <div>Нисам успео да учитам корисника</div>;
  }

  return <Header user={user} />;
}

// components/Header.tsx
import { getFullUserFromCookies } from "@/lib/auth";

export default async function Header() {
  const user = await getFullUserFromCookies();

  if (!user) return null; // ili možeš prikazati "Niste prijavljeni"

  return (
    <div className="flex justify-between items-center flex-row m-2.5 h-10 top-0 left-0 pr-4">
      <p>{user.name}</p>
    </div>
  );
}

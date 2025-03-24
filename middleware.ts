import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { publicRoutes } from "./config/routes";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proveri da li je korisnik ulogovan (asinhrono dohvatanje cookies)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  // Ako je ulogovan i ode na `/`, preusmeri ga na `/cerebro`
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/cerebro", request.url));
  }

  // Ako je ulogovan i pokušava da pristupi public rutama (login/register), preusmeri na cerebro
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/cerebro", request.url));
  }

  // Ako nije ulogovan i pokušava da pristupi privatnim rutama, preusmeri ga na login
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"], // Exclude API and static routes
};

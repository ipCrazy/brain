import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers"; // Ensure this import is correct
import { publicRoutes } from "./config/routes";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  // If the user is logged in and tries to access login or register routes, redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If the user is trying to access a protected route and is not logged in, redirect to /login
  if (!token && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"], // Exclude API and static routes
};

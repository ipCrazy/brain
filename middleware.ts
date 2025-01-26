// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { publicRoutes } from "./config/routes";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  // If the user is logged in and tries to access login or register routes, redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    console.log("User is already logged in, redirecting to /dashboard");
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If the user is trying to access a protected route and is not logged in, redirect to /login
  if (!token && !publicRoutes.includes(pathname)) {
    console.log("Auth token not found, redirecting to /login");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Exclude certain routes (e.g., static, favicon)
};

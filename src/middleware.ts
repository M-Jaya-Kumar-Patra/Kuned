import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("🔥 Middleware:", pathname, "Token:", token);

  // 🔐 Protected routes
  const protectedRoutes = [
    "/profile",
    "/dashboard",
    "/payments",
    "/coins",
    "/withdraw",
    "/saved",
    "/chat",
    "/buy-coins",
    "/create",
    "/my-reports",
    "/payment-status",
    "/report",
  ];

  // 🚫 Auth routes
  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];

  // 🔐 Block protected routes if NOT logged in
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Block auth pages if logged in
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/dashboard",
    "/payments",
    "/coins",
    "/withdraw",
    "/saved",
    "/chat",
    "/buy-coins",
    "/create",
    "/my-reports",
    "/payment-status",
    "/report",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
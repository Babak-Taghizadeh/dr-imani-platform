import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role;

  const isAdmin = role === "admin";
  const isUser = role === "user";

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isUserProtectedRoute =
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/booking") ||
    req.nextUrl.pathname.startsWith("/appointments");

  // Admin routes require admin role
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // User protected routes require user role
  if (isUserProtectedRoute && !isUser) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/booking/:path*",
    "/appointments/:path*",
  ],
};

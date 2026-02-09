import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as JWT | null)?.role;

  if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*"],
};

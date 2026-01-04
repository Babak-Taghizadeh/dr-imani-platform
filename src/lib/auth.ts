import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  checkRateLimit,
  RATE_LIMITS,
} from "@/lib/rate-limit";

// Valid roles
const VALID_ROLES = ["admin", "user"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

function isValidRole(role: unknown): role is ValidRole {
  return typeof role === "string" && VALID_ROLES.includes(role as ValidRole);
}

export const authOptions = {
  providers: [
    Credentials({
      id: "admin",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          // Rate limiting by username
          const rateLimit = checkRateLimit(
            `admin:${credentials.username}`,
            RATE_LIMITS.LOGIN,
          );

          if (!rateLimit.allowed) {
            // Log but don't reveal rate limit to user (security through obscurity)
            console.warn(
              `Rate limit exceeded for admin login: ${credentials.username}`,
            );
            return null;
          }

          // Verify credentials
          const isValid =
            credentials.username === process.env.ADMIN_USERNAME &&
            credentials.password === process.env.ADMIN_PASSWORD;

          if (isValid) {
            return { id: "admin", name: "Admin", role: "admin" as const };
          }

          return null;
        } catch (error) {
          // Log error but don't expose details
          console.error("Admin auth error:", error instanceof Error ? error.message : "Unknown error");
          return null;
        }
      },
    }),
    Credentials({
      id: "user",
      name: "User Login",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.phoneNumber || !credentials?.password) {
          return null;
        }

        try {
          // Rate limiting by phone number
          const rateLimit = checkRateLimit(
            `user:${credentials.phoneNumber}`,
            RATE_LIMITS.LOGIN,
          );

          if (!rateLimit.allowed) {
            // Log but don't reveal rate limit to user (security through obscurity)
            console.warn(
              `Rate limit exceeded for user login: ${credentials.phoneNumber}`,
            );
            return null;
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.phoneNumber, credentials.phoneNumber))
            .limit(1);

          if (user.length === 0) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user[0].passwordHash,
          );

          if (isValid) {
            return {
              id: user[0].id,
              name: user[0].name,
              role: "user" as const,
            };
          }

          return null;
        } catch (error) {
          // Log error but don't expose details
          console.error("User auth error:", error instanceof Error ? error.message : "Unknown error");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - refresh token every 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        // Explicitly validate role - never default to "user" if role is invalid
        if (isValidRole(user.role)) {
          token.role = user.role;
        } else {
          // If role is invalid, reject the token
          throw new Error("Invalid user role");
        }
      } else {
        // On token refresh, validate existing role
        if (!isValidRole(token.role)) {
          // If token has invalid role, reject it
          throw new Error("Invalid token role");
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        // Validate token role before assigning to session
        if (!isValidRole(token.role)) {
          throw new Error("Invalid session role");
        }
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  url:
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "http://localhost:3000"),
};

export default NextAuth(authOptions);

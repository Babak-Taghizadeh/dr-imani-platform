import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
        const isValid =
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD;

        if (isValid) {
          return { id: "admin", name: "Admin", role: "admin" };
        }

        return null;
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
        if (!credentials?.phoneNumber || !credentials?.password) {
          return null;
        }

        try {
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
              role: "user",
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id;
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

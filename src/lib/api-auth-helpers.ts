import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

/**
 * Valid roles in the system
 */
export type UserRole = "admin" | "user";

/**
 * Extended session with role information
 */
export interface AuthenticatedSession extends Session {
  user: {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

/**
 * Custom error class for authentication errors
 * This allows throwing NextResponse objects that can be caught and returned
 */
export class AuthError extends Error {
  constructor(public response: NextResponse) {
    super("Authentication error");
    this.name = "AuthError";
  }
}

/**
 * Validates that a role is one of the allowed roles
 */
function isValidRole(role: unknown): role is UserRole {
  return role === "admin" || role === "user";
}

/**
 * Requires authentication for API routes
 * @returns Session object or throws AuthError with NextResponse
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new AuthError(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );
  }

  // Validate role exists and is valid
  if (!session.user.role || !isValidRole(session.user.role)) {
    throw new AuthError(
      NextResponse.json({ error: "Invalid session" }, { status: 401 }),
    );
  }

  return session as AuthenticatedSession;
}

/**
 * Requires admin role for API routes
 * @returns Session object with admin role or throws AuthError with NextResponse
 */
export async function requireAdmin(): Promise<AuthenticatedSession> {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    throw new AuthError(
      NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    );
  }

  return session;
}

/**
 * Requires user role for API routes
 * @returns Session object with user role or throws AuthError with NextResponse
 */
export async function requireUser(): Promise<AuthenticatedSession> {
  const session = await requireAuth();

  if (session.user.role !== "user") {
    throw new AuthError(
      NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    );
  }

  return session;
}

/**
 * Type guard to check if an error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Wrapper function for API route handlers with authentication
 * Automatically handles authentication and error responses
 *
 * @param handler - The route handler function
 * @param authFn - Authentication function (requireAuth, requireAdmin, requireUser)
 * @returns Wrapped handler
 *
 * @example
 * ```ts
 * export const GET = withAuth(async (request, session) => {
 *   // session is guaranteed to be authenticated
 *   return NextResponse.json({ user: session.user });
 * }, requireAuth);
 * ```
 */
export function withAuth<T extends NextRequest>(
  handler: (
    request: T,
    session: AuthenticatedSession,
    ...args: unknown[]
  ) => Promise<NextResponse>,
  authFn: () => Promise<AuthenticatedSession> = requireAuth,
) {
  return async (request: T, ...args: unknown[]) => {
    try {
      const session = await authFn();
      return await handler(request, session, ...args);
    } catch (error) {
      // If error is AuthError, return its response
      if (isAuthError(error)) {
        return error.response;
      }
      // Otherwise, return generic error
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/**
 * Wrapper specifically for admin routes
 */
export function withAdminAuth<T extends NextRequest>(
  handler: (
    request: T,
    session: AuthenticatedSession,
    ...args: unknown[]
  ) => Promise<NextResponse>,
) {
  return withAuth(handler, requireAdmin);
}

/**
 * Wrapper specifically for user routes
 */
export function withUserAuth<T extends NextRequest>(
  handler: (
    request: T,
    session: AuthenticatedSession,
    ...args: unknown[]
  ) => Promise<NextResponse>,
) {
  return withAuth(handler, requireUser);
}

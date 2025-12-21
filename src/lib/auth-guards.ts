import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Server-side authentication guard for admin routes.
 * Verifies the user has admin role and redirects to signin if not.
 *
 * Must be called at the page/layout level, NOT inside Suspense boundaries.
 * Redirects thrown here will execute correctly and cannot be caught by error boundaries.
 *
 * @throws {RedirectError} Redirects to /signin if user is not authenticated or not admin
 * @returns The authenticated admin session
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin");
  }

  return session;
}

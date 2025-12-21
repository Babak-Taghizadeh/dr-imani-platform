import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guards";

export default async function AdminPage() {
  // Authentication check at page level - redirects execute before any rendering
  await requireAdmin();

  redirect("/admin/appointments");
}

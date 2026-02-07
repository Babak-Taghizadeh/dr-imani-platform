import { redirect } from "next/navigation";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "پنل مدیریت کلینیک خواب دکتر ایمانی",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  other: {
    referrer: "no-referrer",
  },
};

export default async function AdminPage() {
  // Authentication check at page level - redirects execute before any rendering
  await requireAdmin();

  redirect("/admin/appointments");
}

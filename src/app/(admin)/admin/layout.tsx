import AdminHeader from "@/components/sections/admin/admin-header";
import AdminNavigation from "@/components/sections/admin/admin-navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="text-foreground min-h-screen overflow-x-hidden bg-pink-50/80">
      <div className="container mx-auto max-w-6xl space-y-10 px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12">
        <AdminHeader />
        <AdminNavigation />
        {children}
      </div>
    </main>
  );
}

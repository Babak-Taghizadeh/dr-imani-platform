import AdminHeader from "@/components/sections/admin/admin-header";
import BlogTable from "@/components/sections/admin/blogs-table";

const AdminPage = () => {
  return (
    <main className="bg-muted flex min-h-screen flex-col items-center">
      <AdminHeader />
      <BlogTable />
    </main>
  );
};

export default AdminPage;

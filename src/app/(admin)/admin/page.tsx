import AdminHeader from "@/components/sections/admin/admin-header";
import BlogTable from "@/components/sections/admin/blogs-table";
import getBlogs from "@/utils/get-blogs";

const AdminPage = async () => {
  const blogs = await getBlogs();
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <AdminHeader />
          <div className="bg-card rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
            <BlogTable blogs={blogs} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;

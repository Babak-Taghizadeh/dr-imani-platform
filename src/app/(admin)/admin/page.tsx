import AdminHeader from "@/components/sections/admin/admin-header";
import BlogTable from "@/components/sections/admin/blogs-table";
import getBlogs from "@/utils/get-blogs";

const AdminPage = async () => {
  const blogs = await getBlogs();
  return (
    <main className="bg-muted flex min-h-screen flex-col items-center">
      <AdminHeader />
      <BlogTable blogs={blogs} />
    </main>
  );
};

export default AdminPage;

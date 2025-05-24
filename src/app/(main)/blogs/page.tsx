import BlogCard from "@/components/sections/blog-card";
import getBlogs from "@/utils/get-blogs";

const BlogsPage = async () => {
  const blogs = await getBlogs();

  return (
    <div className="bg-foreground grid grid-cols-1 gap-6 p-12 sm:grid-cols-2 lg:grid-cols-3">
      <h1 className="text-background col-span-full text-xl font-bold md:text-3xl">
        وبلاگ
      </h1>
      {blogs.map((blog, index) => (
        <BlogCard blog={blog} key={index} />
      ))}
    </div>
  );
};

export default BlogsPage;

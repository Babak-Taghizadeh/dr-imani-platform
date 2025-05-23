import BlogCard from "@/components/sections/blog-card";
import { mockBlogs } from "@/lib/mock-data";

const BlogsPage = () => {
  return (
    <div className="bg-foreground grid grid-cols-1 gap-6 p-12 sm:grid-cols-2 lg:grid-cols-3">
      <h1 className="text-background col-span-full text-xl font-bold md:text-3xl">
        وبلاگ
      </h1>
      {mockBlogs.map((blog, index) => (
        <BlogCard blog={blog} key={index} />
      ))}
    </div>
  );
};

export default BlogsPage;

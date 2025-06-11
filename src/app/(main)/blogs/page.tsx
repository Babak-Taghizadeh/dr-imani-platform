import BlogCard from "@/components/sections/blog-card";
import BlogsLoader from "@/components/sections/blogs-loader";
import SectionHeader from "@/components/shared/section-header";
import getBlogs from "@/utils/get-blogs";
import { Suspense } from "react";

const BlogsPage = async () => {
  const blogs = await getBlogs();

  return (
    <div className="bg-foreground grid grid-cols-1 gap-6 px-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
      <SectionHeader
        title="وبلاگ و مقالات"
        className="col-span-full"
        theme="dark"
      />
      <Suspense fallback={<BlogsLoader />}>
        {blogs.map(
          (blog, index) =>
            blog.status === "منتشر شده" && <BlogCard blog={blog} key={index} />,
        )}
      </Suspense>
    </div>
  );
};

export default BlogsPage;

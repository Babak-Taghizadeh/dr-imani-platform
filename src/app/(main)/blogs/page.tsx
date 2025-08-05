import { Suspense } from "react";
import BlogCard from "@/components/sections/blogs/blog-card";
import BlogsLoader from "@/components/sections/blogs/blogs-loader";
import PaginationControls from "@/components/shared/pagination-controls";
import SectionHeader from "@/components/shared/section-header";
import NoContent from "@/components/shared/no-content";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Blog } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مقالات تخصصی خواب",
  description:
    "آخرین مقالات علمی در زمینه اختلالات خواب، درمان بی‌خوابی و آپنه خواب توسط متخصصین کلینیک دکتر ایمانی تبریز",
  keywords: [
    "مقالات خواب",
    "درمان بی خوابی",
    "آپنه خواب",
    "خروپف",
    "بهداشت خواب",
    "مطالب علمی خواب",
    "نوشته‌های دکتر ایمانی",
    "تحقیقات جدید خواب",
    "مقاله پزشکی خواب",
    "راهکارهای بهبود خواب",
  ],
  openGraph: {
    title: "مقالات تخصصی خواب | کلینیک دکتر ایمانی تبریز",
    description: "مجموعه مقالات معتبر در زمینه تشخیص و درمان اختلالات خواب",
    url: "/blogs",
    images: [
      {
        url: "/open-graph/home-fa.png",
        width: 1200,
        height: 630,
        alt: "موقعیت و اطلاعات تماس کلینیک خواب دکتر ایمانی در خیابان آزادی تبریز",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "مقالات تخصصی خواب | کلینیک دکتر ایمانی",
    description: "آخرین یافته‌های علمی در زمینه اختلالات خواب و درمان‌های جدید",
  },
  alternates: {
    canonical: "/blogs",
  },
};

interface BlogsPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const BlogsPage = async ({ searchParams }: BlogsPageProps) => {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { blogs, totalPages } = await fetchPaginatedData<Blog>(
    "blogs",
    "blogs",
    page,
  );

  const publishedBlogs = blogs.filter((b) => b.status === "منتشر شده");

  return (
    <div className="bg-foreground grid grid-cols-1 gap-10 px-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
      <SectionHeader
        title="دانش خواب و سلامت"
        description="مطالب تخصصی درباره اختلالات خواب، بهبود کیفیت خواب، و ارتباط آن با سلامت جسم و روان. راهنمایی‌هایی علمی برای خوابی بهتر."
        className="col-span-full"
        theme="dark"
      />

      {!blogs || publishedBlogs.length === 0 ? (
        <NoContent />
      ) : (
        <Suspense fallback={<BlogsLoader />}>
          {publishedBlogs.map((blog, index) => (
            <BlogCard blog={blog} key={blog.id} index={index} />
          ))}
        </Suspense>
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        className="col-span-full"
        theme="dark"
        queryKey="blogsPage"
      />
    </div>
  );
};

export default BlogsPage;

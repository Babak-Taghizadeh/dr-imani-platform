import BlogsManager from "@/components/sections/admin/blogs/blogs-manager";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Blog } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت بلاگ‌ها",
  description: "سیستم مدیریت محتوای بلاگ کلینیک تخصصی خواب",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
    },
  },
  other: {
    referrer: "no-referrer",
    "cache-control": "no-store, max-age=0",
  },
};

interface BlogsPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { blogs, totalPages } = await fetchPaginatedData<Blog>(
    "blogs",
    "blogs",
    page,
  );

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <BlogsManager blogs={blogs} page={page} totalPages={totalPages} />
    </div>
  );
}

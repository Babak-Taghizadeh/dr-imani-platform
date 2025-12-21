import BlogsManager from "@/components/sections/admin/blogs/blogs-manager";
import { getPaginatedBlogs } from "@/utils/blog-services";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guards";

export const dynamic = "force-dynamic";

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
  },
};

interface BlogsPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  // Authentication check at page level - redirects execute before any rendering
  await requireAdmin();

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);

  const { blogs, totalPages } = await getPaginatedBlogs(page);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <BlogsManager blogs={blogs} page={page} totalPages={totalPages} />
    </div>
  );
}

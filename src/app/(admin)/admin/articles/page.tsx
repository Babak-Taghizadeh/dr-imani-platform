import ArticlesManager from "@/components/sections/admin/articles/articles-manager";
import { getPaginatedArticles } from "@/utils/articles-services";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مدیریت مقالات",
  description: "سیستم مدیریت محتوای مقالات کلینیک تخصصی خواب",
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

interface ArticlesPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  // Authentication check at page level - redirects execute before any rendering
  await requireAdmin();

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);

  const { articles, totalPages } = await getPaginatedArticles(page);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <ArticlesManager
        articles={articles}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}

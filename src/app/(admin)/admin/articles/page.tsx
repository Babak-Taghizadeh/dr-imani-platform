import ArticlesManager from "@/components/sections/admin/articles/articles-manager";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Article } from "@/lib/types";
import { Metadata } from "next";

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
    "cache-control": "no-store, max-age=0",
  },
};

interface ArticlesPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { articles, totalPages } = await fetchPaginatedData<Article>(
    "articles",
    "articles",
    page,
  );

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

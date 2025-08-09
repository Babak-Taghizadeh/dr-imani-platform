import ArticleCard from "@/components/sections/articles/article-card";
import { ArticlesLoader } from "@/components/sections/articles/articles-loader";
import NoContent from "@/components/shared/no-content";
import PaginationControls from "@/components/shared/pagination-controls";
import SectionHeader from "@/components/shared/section-header";
import { Article } from "@/lib/types";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "مقالات علمی خواب",
  description:
    "مجموعه مقالات معتبر پزشکی درباره اختلالات خواب، درمان‌های جدید و پژوهش‌های تخصصی توسط کلینیک دکتر ایمانی تبریز",
  keywords: [
    "مقالات پزشکی خواب",
    "تحقیقات جدید اختلالات خواب",
    "درمان آپنه خواب",
    "پژوهش‌های بی‌خوابی",
    "مطالعات علمی خواب",
    "مقاله‌های دکتر ایمانی",
    "تازه‌های پزشکی خواب",
    "مجله تخصصی خواب",
    "یافته‌های جدید خواب",
    "منابع علمی اختلالات خواب",
  ],
  openGraph: {
    title: "مقالات علمی خواب | کلینیک دکتر ایمانی",
    description:
      "منبع معتبر مقالات پژوهشی و پزشکی درباره انواع اختلالات خواب و درمان‌های نوین",
    url: "/articles",
    images: [
      {
        url: "/images/home-fa.jpg",
        width: 1200,
        height: 630,
        alt: "مقالات تخصصی خواب کلینیک دکتر ایمانی تبریز",
      },
    ],
  },
  alternates: {
    canonical: "/articles",
  },
  other: {
    "content-type": "scientific_articles",
    author: "دکتر ایمانی و تیم تحقیقاتی",
  },
};

interface ArticlesPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { articles, totalPages } = await fetchPaginatedData<Article>(
    "articles",
    "articles",
    page,
  );

  return (
    <main className="bg-foreground grid grid-cols-1 items-center gap-10 px-8 py-12 md:grid-cols-2 xl:grid-cols-3">
      <SectionHeader
        title="مقالات علمی و تخصصی"
        description="دسترسی به پژوهش‌ها، مقالات تخصصی، و پایان‌نامه‌های منتشرشده در حوزه پزشکی خواب و سلامت. این بخش بازتابی از تجربیات و مطالعات علمی خانم دکتر ایمانی میباشد."
        className="col-span-full"
        theme="dark"
      />
      {!articles || articles.length === 0 ? (
        <NoContent />
      ) : (
        <Suspense fallback={<ArticlesLoader />}>
          {articles?.map((article, index) => (
            <ArticleCard article={article} key={article.id} index={index} />
          ))}
        </Suspense>
      )}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        className="col-span-full"
        theme="dark"
        queryKey="articlesPage"
      />
    </main>
  );
};

export default ArticlesPage;

import ArticleCard from "@/components/sections/articles/article-card";
import { ArticlesLoader } from "@/components/sections/articles/articles-loader";
import NoContent from "@/components/shared/no-content";
import PaginationControls from "@/components/shared/pagination-controls";
import SectionHeader from "@/components/shared/section-header";
import { Article } from "@/lib/types";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Suspense } from "react";

interface ArticlesPageProps {
  searchParams?: { page?: string };
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
          {articles?.map((article) => (
            <ArticleCard article={article} key={article.id} />
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

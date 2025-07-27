import ArticleCard from "@/components/sections/articles/article-card";
import { ArticlesLoader } from "@/components/sections/articles/articles-loader";
import NoContent from "@/components/shared/no-content";
import PaginationControls from "@/components/shared/pagination-controls";
import SectionHeader from "@/components/shared/section-header";
import fetchArticles from "@/utils/fetch-articles";
import { Suspense } from "react";

interface ArticlesPageProps {
  searchParams?: { page?: string };
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { articles, totalPages } = await fetchArticles(page);

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
      />
    </main>
  );
};

export default ArticlesPage;

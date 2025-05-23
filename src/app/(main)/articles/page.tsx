import ArticleCard from "@/components/sections/article-card";
import { mockArticles } from "@/lib/mock-data";

const ArticlesPage = () => {
  return (
    <main className="bg-foreground text-background place-items-center px-4 py-8">
      <h1 className="mb-6 text-xl font-bold md:text-3xl">
        مقالات و پژوهش‌های تخصصی
      </h1>
      <div className="space-y-6">
        {mockArticles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </main>
  );
};

export default ArticlesPage;

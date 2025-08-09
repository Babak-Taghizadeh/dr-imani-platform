import { Suspense } from "react";
import { Article } from "@/lib/types";
import ArticlesTable from "./articles-table";
import PaginationControls from "@/components/shared/pagination-controls";
import TableSkeleton from "../table-skeleton";
import { ModifyArticleModal } from "./modify-article-modal";

interface ArticlesManagerProps {
  articles: Article[];
  page: number;
  totalPages: number;
}

const ArticlesManager = ({
  articles,
  page,
  totalPages,
}: ArticlesManagerProps) => {
  return (
    <div className="space-y-6">
      <ModifyArticleModal mode="create" />
      <Suspense fallback={<TableSkeleton />}>
        <ArticlesTable articles={articles} />
      </Suspense>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          theme="light"
          queryKey="articlesPage"
        />
      )}
    </div>
  );
};

export default ArticlesManager;

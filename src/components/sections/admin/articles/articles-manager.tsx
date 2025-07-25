import { Suspense } from "react";
import { Article } from "@/lib/types";
import AddArticle from "./add-article";
import ArticlesTable from "./articles-table";
import PaginationControls from "@/components/shared/pagination-controls";
import TableSkeleton from "../table-skeleton";

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
      <AddArticle />
      <Suspense fallback={<TableSkeleton />}>
        <ArticlesTable articles={articles} />
      </Suspense>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          theme="light"
        />
      )}
    </div>
  );
};

export default ArticlesManager;

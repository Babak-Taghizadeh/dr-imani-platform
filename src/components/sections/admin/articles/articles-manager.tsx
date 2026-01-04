import { Article } from "@/types/types";
import ArticlesTable from "./articles-table";
import PaginationControls from "@/components/shared/pagination-controls";
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
    <>
      <ModifyArticleModal mode="create" />
      <ArticlesTable articles={articles} />
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          theme="light"
          queryKey="page"
        />
      )}
    </>
  );
};

export default ArticlesManager;

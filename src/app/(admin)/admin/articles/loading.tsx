import { ArticlesTableSkeleton } from "@/components/sections/admin/articles/articles-table-skeleton";
import { ModifyArticleModal } from "@/components/sections/admin/articles/modify-article-modal";

export default function ArticlesLoading() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <ModifyArticleModal mode="create" />
      <ArticlesTableSkeleton />
    </div>
  );
}

import { Suspense } from "react";
import BlogTable from "./blogs-table";
import TableSkeleton from "../table-skeleton";
import PaginationControls from "@/components/shared/pagination-controls";
import { Blog } from "@/lib/types";
import { ModifyBlogModal } from "./modify-blog-modal";

interface BlogsManagerProps {
  blogs: Blog[];
  page: number;
  totalPages: number;
}

const BlogsManager = ({ blogs, page, totalPages }: BlogsManagerProps) => {
  return (
    <>
      <ModifyBlogModal mode="create" />
      <Suspense fallback={<TableSkeleton />}>
        <BlogTable blogs={blogs} />
      </Suspense>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          theme="light"
          queryKey="blogsPage"
        />
      )}
    </>
  );
};

export default BlogsManager;

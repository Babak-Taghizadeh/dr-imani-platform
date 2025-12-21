import BlogTable from "./blogs-table";
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
      <BlogTable blogs={blogs} />
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

export default BlogsManager;

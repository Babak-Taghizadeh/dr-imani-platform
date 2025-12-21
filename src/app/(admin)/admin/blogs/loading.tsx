import { BlogsTableSkeleton } from "@/components/sections/admin/blogs/blogs-table-skeleton";
import { ModifyBlogModal } from "@/components/sections/admin/blogs/modify-blog-modal";

export default function BlogsLoading() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <ModifyBlogModal mode="create" />
      <BlogsTableSkeleton />
    </div>
  );
}

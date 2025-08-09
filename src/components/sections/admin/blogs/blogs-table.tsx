"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModifyBlogModal } from "./modify-blog-modal";
import { SureDeleteModal } from "../sure-delete-modal";
import { useBlockUI } from "@/hooks/use-block-ui";

const BlogTable = ({ blogs }: { blogs: Blog[] }) => {
  const router = useRouter();
  const { blockUI, BlockUI } = useBlockUI();

  const handleUpdateBlog = async (blogSlug: string, formData: FormData) => {
    return blockUI(
      fetch(`/api/blogs/${blogSlug}`, {
        method: "PUT",
        body: formData,
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "خطا در بروزرسانی بلاگ.");
          }
          toast.success("بلاگ با موفقیت بروزرسانی شد.");
          router.refresh();
        })
        .catch((error) => {
          console.error("Error updating blog:", error);
          toast.error("خطا در بروزرسانی بلاگ، دوباره تلاش کنید.");
        }),
    );
  };

  return (
    <div className="relative w-full">
      <BlockUI>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">عنوان</TableHead>
                <TableHead className="w-[20%]">وضعیت</TableHead>
                <TableHead className="w-[20%]">تاریخ</TableHead>
                <TableHead className="w-[20%] text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="group hover:bg-muted/50 transition-all"
                  >
                    <TableCell className="font-semibold">
                      {blog.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          blog.status === "منتشر شده" ? "default" : "secondary"
                        }
                        className="font-medium"
                      >
                        {blog.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                        locale: faIR,
                      })}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <ModifyBlogModal
                        blog={blog}
                        onSave={(formData) =>
                          handleUpdateBlog(blog.slug, formData)
                        }
                      />
                      <SureDeleteModal
                        itemPath={blog.slug}
                        itemType="blog"
                        apiPath="/api/blogs"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground h-24 text-center"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm">بلاگی یافت نشد.</p>
                      <p className="text-xs">
                        برای شروع، یک بلاگ جدید اضافه کنید.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </BlockUI>
    </div>
  );
};

export default BlogTable;

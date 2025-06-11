"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SureDeleteModal from "./sure-delete-modal";
import { Blog } from "@/lib/types";
import ModifyBlogModal from "./modify-blog-modal";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { toast } from "sonner";

const BlogTable = ({ blogs }: { blogs: Blog[] }) => {
  const handleUpdateBlog = async (blogId: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در بروزرسانی بلاگ");
      }

      toast("بلاگ با موفقیت بروزرسانی شد");
      // Optionally refresh your blog list or update UI here
      // You might want to trigger a refetch of the blogs data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("خطا در بروزرسانی بلاگ، دوباره تلاش کنید");
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[40%]">عنوان</TableHead>
              <TableHead className="w-[20%]">وضعیت انتشار</TableHead>
              <TableHead className="w-[20%]">تاریخ</TableHead>
              <TableHead className="w-[20%] text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <TableRow
                  key={blog.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === "منتشر شده" ? "default" : "secondary"
                      }
                      className="font-normal"
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
                      onSave={(formData) => handleUpdateBlog(blog.id, formData)}
                    />
                    <SureDeleteModal />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
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
    </div>
  );
};

export default BlogTable;

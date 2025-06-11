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

const BlogTable = ({ blogs }: { blogs: Blog[] }) => {
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
                    <ModifyBlogModal blog={blog} onSave={() => {}} />
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

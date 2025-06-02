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

const BlogTable = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="mt-24 w-full overflow-auto px-4 lg:w-1/2">
      <Table className="rounded-lg border">
        <TableHeader>
          <TableRow>
            <TableHead>عنوان</TableHead>
            <TableHead>وضعیت انتشار</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.status}</TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  {/* Must split CTA to prevent unnecessary use client */}
                  <ModifyBlogModal blog={blog} onSave={() => {}} />
                  <SureDeleteModal />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground py-6 text-center"
              >
                بلاگی یافت نشد.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;

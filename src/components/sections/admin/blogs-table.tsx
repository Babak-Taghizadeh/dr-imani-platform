"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ModifyBlog } from "./modify-blog-modal";
import { mockBlogs } from "@/lib/mock-data";

export default function BlogTable() {
  return (
    <div className="mt-24 w-1/2 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان</TableHead>
            <TableHead>وضعیت انتشار</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockBlogs.length > 0 ? (
            mockBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.status}</TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <ModifyBlog blog={blog} onSave={() => {}} />
                  <Button variant="destructive" size="sm" onClick={() => {}}>
                    حذف
                  </Button>
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
}

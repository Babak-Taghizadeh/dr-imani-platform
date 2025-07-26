"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModifyArticleModal } from "./modify-article-modal";
import { SureDeleteModal } from "../sure-delete-modal";

const ArticlesTable = ({ articles }: { articles?: Article[] }) => {
  const router = useRouter();

  const handleUpdateArticle = async (articleId: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در بروزرسانی مقاله");
      }

      toast("مقاله با موفقیت بروزرسانی شد");
      router.refresh();
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("خطا در بروزرسانی مقاله، دوباره تلاش کنید");
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">عنوان</TableHead>
              <TableHead className="w-[40%]">خلاصه</TableHead>
              <TableHead className="w-[20%]">تاریخ انتشار</TableHead>
              <TableHead className="w-[15%] text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="group hover:bg-muted/50 transition-all"
                >
                  <TableCell className="font-semibold">
                    {article.title}
                  </TableCell>
                  <TableCell className="text-accent-foreground max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {article.summary}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <ModifyArticleModal
                      article={article}
                      onSave={(formData) =>
                        handleUpdateArticle(article.id, formData)
                      }
                    />
                    <SureDeleteModal
                      itemId={article.id}
                      itemType="article"
                      apiPath="/api/articles"
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
                    <p className="text-sm">مقاله‌ای یافت نشد.</p>
                    <p className="text-xs">
                      برای شروع، یک مقاله جدید اضافه کنید.
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

export default ArticlesTable;

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

interface SureDeleteModalProps {
  itemPath: string | number;
  itemType: "blog" | "article";
  apiPath: string;
}

export const SureDeleteModal = ({
  itemPath,
  itemType,
  apiPath,
}: SureDeleteModalProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`${apiPath}/${itemPath}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("خطا در حذف");

        toast.success(
          itemType === "blog"
            ? "بلاگ با موفقیت حذف شد."
            : "مقاله با موفقیت حذف شد.",
        );

        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          itemType === "blog" ? "خطا در حذف بلاگ." : "خطا در حذف مقاله.",
        );
      }
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            حذف
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              {itemType === "blog"
                ? "این عمل بلاگ را به طور کامل حذف خواهد کرد."
                : "این عمل مقاله را به طور کامل حذف خواهد کرد."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90 text-background"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تایید و حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

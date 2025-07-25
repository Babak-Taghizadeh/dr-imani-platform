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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SureDeleteModalProps {
  itemId: string;
  itemType: "blog" | "article";
  apiPath: string;
}

export const SureDeleteModal = ({
  itemId,
  itemType,
  apiPath,
}: SureDeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${apiPath}/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("خطا در حذف");
      }

      toast.success(
        itemType === "blog"
          ? "بلاگ با موفقیت حذف شد"
          : "مقاله با موفقیت حذف شد",
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(itemType === "blog" ? "خطا در حذف بلاگ" : "خطا در حذف مقاله");
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        حذف
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
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
            <AlertDialogCancel disabled={isDeleting}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "در حال حذف..." : "تایید و حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

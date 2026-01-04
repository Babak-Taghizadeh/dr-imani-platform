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

interface SureDeleteDisabledDateModalProps {
  disabledDateId: string;
}

export const SureDeleteDisabledDateModal = ({
  disabledDateId,
}: SureDeleteDisabledDateModalProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/admin/disable-dates/${disabledDateId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "خطا در حذف");
        }

        toast.success("بازه تاریخ با موفقیت حذف شد");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "خطا در حذف بازه تاریخ",
        );
      }
    });
  };

  return (
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
            این عمل بازه تاریخ را به طور کامل حذف خواهد کرد و تاریخ‌های این
            بازه دوباره برای رزرو در دسترس خواهند بود.
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
  );
};

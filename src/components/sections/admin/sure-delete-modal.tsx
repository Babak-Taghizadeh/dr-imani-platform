"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const SureDeleteModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          حذف
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="py-8 sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            آیا از حذف بلاگ اطمینان دارید؟
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-4 flex w-full justify-center!">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              خیر
            </Button>
          </DialogClose>
          <Button variant="destructive" type="submit">
            بله
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SureDeleteModal;

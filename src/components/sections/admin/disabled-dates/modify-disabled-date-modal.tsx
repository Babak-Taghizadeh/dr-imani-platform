"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DisableDatesForm } from "./disable-dates-form";

interface DisabledDateRange {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

interface ModifyDisabledDateModalProps {
  disabledDate: DisabledDateRange;
}

export const ModifyDisabledDateModal = ({
  disabledDate,
}: ModifyDisabledDateModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ویرایش
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          // Prevent modal from closing when clicking on datepicker
          const target = e.target as HTMLElement;
          if (
            target.closest("[data-jdp-container]") ||
            target.closest(".jdp-container") ||
            target.closest(".jdp-wrapper") ||
            target.closest('[class*="jdp"]') ||
            target.closest('[id*="jdp"]')
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center">ویرایش بازه تاریخ</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DisableDatesForm
            disabledDate={disabledDate}
            mode="edit"
            onSuccess={handleSuccess}
            hideCard={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

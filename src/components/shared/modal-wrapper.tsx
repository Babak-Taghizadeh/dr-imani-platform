import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface DialogModalWrapperProps {
  triggerLabel: string;
  title: string;
  children: ReactNode;
  triggerClassName?: string;
  maxWidth?: string;
  isModalOpen?: boolean;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogModalWrapper = ({
  triggerLabel,
  title,
  children,
  triggerClassName,
  maxWidth = "sm:max-w-2xl",
  isModalOpen,
  setModalOpen,
}: DialogModalWrapperProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`max-h-[90vh] overflow-y-auto ${maxWidth}`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

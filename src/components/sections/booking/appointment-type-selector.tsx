"use client";
import { Card } from "@/components/ui/card";
import { Phone, Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import WhatsAppIcon from "../../../public/icons/whatsapp.svg";
import Link from "next/link";

interface AppointmentTypeSelectorProps {
  value?: "ONLINE_PHONE" | "IN_CLINIC" | "FOREIGN_PATIENT";
  onChange: (value: "ONLINE_PHONE" | "IN_CLINIC" | "FOREIGN_PATIENT") => void;
}

export function AppointmentTypeSelector({
  value,
  onChange,
}: AppointmentTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card
        className={cn(
          "hover:border-primary flex-1 cursor-pointer transition-all",
          value === "ONLINE_PHONE" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("ONLINE_PHONE")}
      >
        <div className="text-center md:p-6">
          <Phone className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">تماس تلفنی</h3>
          <p className="text-accent-foreground mt-1 text-sm">
            مشاوره آنلاین از طریق تماس
          </p>
        </div>
      </Card>
      <Card
        className={cn(
          "hover:border-primary flex-1 cursor-pointer transition-all",
          value === "IN_CLINIC" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("IN_CLINIC")}
      >
        <div className="text-center md:p-6">
          <Building2 className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">حضوری</h3>
          <p className="text-accent-foreground mt-1 text-sm">مراجعه به مطب</p>
        </div>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className={cn(
              "hover:border-primary flex-1 cursor-pointer transition-all",
              value === "FOREIGN_PATIENT" && "border-primary bg-primary/5",
            )}
          >
            <div className="text-center md:p-6">
              <Globe className="mx-auto mb-2 h-8 w-8" />
              <h3 className="font-semibold">بیماران خارجی</h3>
              <p className="text-accent-foreground mt-1 text-sm">
                رزرو آنلاین برای بیماران خارج از کشور
              </p>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              رزرو نوبت برای بیماران خارجی
            </DialogTitle>
            <DialogDescription className="text-accent-foreground pt-2 text-center">
              برای رزرو نوبت آنلاین خارج از کشور، لطفاً از طریق واتساپ با ما در
              ارتباط باشید.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                انصراف
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                asChild
                className="w-full bg-[#25D366] font-semibold hover:bg-[#25D366]/90 sm:w-auto"
              >
                <Link
                  href="https://wa.me/989147360827"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={WhatsAppIcon}
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="mr-2 brightness-0 invert"
                  />
                  انتقال به واتساپ
                </Link>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

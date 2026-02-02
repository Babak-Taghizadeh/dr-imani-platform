"use client";

import { Calendar, Headset } from "lucide-react";
import { WhatsAppButton } from "./whatsapp-button";
import { PhoneButton } from "./phone-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import RubikaIcon from "../../../public/icons/rubika.png";
import { Button } from "../ui/button";
import Link from "next/link";

export function FloatingContactButton() {
  return (
    <div className="fixed right-6 bottom-6 z-50" dir="rtl">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="bg-blue-500 text-lg drop-shadow-lg drop-shadow-blue-600 hover:bg-blue-600"
          >
            ارتباط سریع
            <Headset />
          </Button>
          {/* <button
            className={cn(
              "relative flex h-14 w-14 items-center justify-center",
              "bg-blue-500 shadow-2xl hover:shadow-xl",
            )}
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
            aria-label="راه‌های ارتباطی"
          >
            <Headset className="text-primary-foreground h-6 w-6" />
          </button> */}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          sideOffset={10}
          className="w-80 p-4"
        >
          <div className="flex flex-col gap-4">
            {/* Header */}
            <h3 className="text-lg font-semibold">راه‌های ارتباطی</h3>

            {/* WhatsApp and Phone Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                className="text-background bg-gradient-to-r from-blue-600 to-purple-600 font-bold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                asChild
                aria-label="دریافت نوبت اینترنتی"
                tabIndex={0}
              >
                <Link href="/booking">
                  نوبت دهی اینترنتی
                  <Calendar />
                </Link>
              </Button>
              <WhatsAppButton />
              <PhoneButton />
            </div>

            {/* Rubika Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="rubika" className="border-none">
                <AccordionTrigger className="flex justify-center py-2 text-base font-medium">
                  <Image src={RubikaIcon} alt="Rubika Icon" />
                </AccordionTrigger>
                <AccordionContent className="text-accent-foreground pt-2 text-sm">
                  <div className="space-y-2">
                    <p>شماره تماس را در مخاطبین خود ذخیره کنید:</p>
                    <p
                      dir="ltr"
                      className="text-foreground font-mono font-semibold"
                    >
                      ۰۹۱۴ ۷۳۶ ۰۸۲۶
                    </p>
                    <p>سپس در اپلیکیشن روبیکا، بخش مخاطبین را بررسی کنید.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";

import { Calendar, Users, Clock, CheckCircle2 } from "lucide-react";
import { toShamsi } from "@/lib/shamsi-utils";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { calculatePrice } from "@/lib/price-calculator";
import type { UseFormReturn } from "react-hook-form";
import type { BookingFormData } from "@/lib/validation-schema";

interface ConfirmationSummaryProps {
  form: UseFormReturn<BookingFormData>;
}

export function ConfirmationSummary({ form }: ConfirmationSummaryProps) {
  const appointmentType = form.watch("appointmentType");
  const ageRange = form.watch("ageRange");
  const date = form.watch("date");
  const time = form.watch("time");

  const appointmentTypeLabel =
    appointmentType === "ONLINE_PHONE" ? "تماس تلفنی" : "حضوری";
  const ageRangeLabel =
    ageRange === "UNDER_15"
      ? `زیر ${toPersianNumber(15)} سال`
      : `بالای ${toPersianNumber(15)} سال`;
  const price = ageRange ? calculatePrice(ageRange) : 0;

  const summaryItems = [
    {
      icon: Calendar,
      label: "نوع نوبت",
      value: appointmentTypeLabel,
    },
    {
      icon: Users,
      label: "گروه سنی",
      value: ageRangeLabel,
    },
    {
      icon: Calendar,
      label: "تاریخ",
      value: date ? toShamsi(date) : "-",
    },
    {
      icon: Clock,
      label: "زمان",
      value: time ? toPersianNumber(time) : "-",
    },
  ];

  return (
    <div className="min-h-[480px] space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="text-primary h-5 w-5" />
        <h3 className="text-lg font-semibold">تأیید اطلاعات</h3>
      </div>

      <div className="bg-muted/50 space-y-4 rounded-lg border p-6">
        {summaryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <span className="text-accent-foreground font-medium">
                  {item.label}:
                </span>
              </div>
              <span className="font-semibold">{item.value}</span>
            </div>
          );
        })}

        <div className="bg-primary/5 border-primary/20 mt-6 flex items-center justify-between rounded-lg border-2 p-4">
          <span className="text-sm font-bold md:text-base">
            مبلغ قابل پرداخت:
          </span>
          <span className="text-primary text-base font-bold md:text-xl">
            {price.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </div>
    </div>
  );
}

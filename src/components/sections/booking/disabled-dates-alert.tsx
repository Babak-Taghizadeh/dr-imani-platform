"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toShamsi } from "@/lib/shamsi-utils";

interface DisabledDatesAlertProps {
  disabledDates: Array<{
    startDate: string;
    endDate: string;
    reason?: string | null;
  }>;
}

export function DisabledDatesAlert({ disabledDates }: DisabledDatesAlertProps) {
  if (disabledDates.length === 0) {
    return null;
  }

  return (
    <Alert className="mt-auto mb-1 bg-blue-950">
      <Info className="h-4 w-4" color="white" />
      <AlertTitle className="text-blue-50">اطلاعیه تعطیلی کلینیک</AlertTitle>
      <AlertDescription className="mt-2 space-y-2 text-blue-100">
        <p className="text-sm">کلینیک در بازه‌های زمانی زیر تعطیل می‌باشد:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          {disabledDates.map((range, index) => (
            <li key={index}>
              <span className="font-medium">
                {toShamsi(range.startDate)} تا {toShamsi(range.endDate)}
              </span>
              {range.reason && (
                <span className="mr-2 text-blue-100">({range.reason})</span>
              )}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

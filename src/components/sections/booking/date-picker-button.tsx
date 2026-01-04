"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toPersianNumber } from "@/lib/persian-number-utils";
import type { ShamsiDateInfo } from "@/hooks/use-visible-dates";
import { Badge } from "@/components/ui/badge";

interface DatePickerButtonProps {
  dateInfo: ShamsiDateInfo;
  isSelected: boolean;
  isDisabled: boolean;
  onDateClick: (dateInfo: ShamsiDateInfo) => void;
}

export function DatePickerButton({
  dateInfo,
  isSelected,
  isDisabled,
  onDateClick,
}: DatePickerButtonProps) {
  // Show skeleton loader while checking availability
  if (dateInfo.isCheckingAvailability) {
    return (
      <Skeleton
        key={dateInfo.gregorianDateStr}
        className="h-24 w-full rounded-md"
      />
    );
  }

  return (
    <Button
      key={dateInfo.gregorianDateStr}
      variant={isSelected ? "default" : "outline"}
      onClick={() => onDateClick(dateInfo)}
      disabled={isDisabled}
      className={cn(
        "relative h-auto flex-col p-2 sm:p-3",
        isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
        isDisabled && "cursor-not-allowed !opacity-100",
      )}
    >
      <span
        className={cn(
          "text-[10px] sm:text-xs",
          isDisabled ? "text-accent-foreground/30" : "text-accent-foreground",
          isSelected && "text-primary-foreground",
        )}
      >
        {dateInfo.dayName}
      </span>
      <span
        className={cn(
          "text-base font-semibold sm:text-lg",
          isDisabled && "text-accent-foreground/30",
        )}
      >
        {toPersianNumber(dateInfo.shamsiDay)}
      </span>
      <span
        className={cn(
          "text-[10px] sm:text-xs",
          isDisabled ? "text-accent-foreground/30" : "text-accent-foreground",
          isSelected && "text-primary-foreground",
        )}
      >
        {dateInfo.monthName}
      </span>
      {/* Show "بدون نوبت خالی" for dates with no available slots */}
      {dateInfo.hasAvailableSlots === false && (
        <Badge
          variant="destructive"
          className="absolute -top-[26px] left-1/2 -translate-x-1/2 rounded-b-none !bg-red-600 text-sm opacity-100"
        >
          تکمیل شده
        </Badge>
      )}
    </Button>
  );
}

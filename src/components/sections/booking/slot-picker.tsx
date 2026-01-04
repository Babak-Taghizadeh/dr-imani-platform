"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlotPickerSkeleton } from "@/components/sections/booking/slot-picker-skeleton";
import { toPersianNumber } from "@/lib/persian-number-utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelect: (time: string) => void;
  isLoading?: boolean;
}

export function SlotPicker({
  slots,
  selectedTime,
  onSelect,
  isLoading,
}: SlotPickerProps) {
  if (isLoading) {
    return <SlotPickerSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          variant={selectedTime === slot.time ? "default" : "outline"}
          disabled={!slot.available}
          onClick={() => slot.available && onSelect(slot.time)}
          className={cn(
            "relative h-12",
            !slot.available && "cursor-not-allowed !opacity-100",
            selectedTime === slot.time && "bg-primary text-primary-foreground",
          )}
        >
          {slot.available ? (
            toPersianNumber(slot.time)
          ) : (
            <span className="flex flex-col items-center justify-center text-sm">
              <span className="text-muted-foreground">
                {toPersianNumber(slot.time)}
              </span>
              <span className="text-xs font-bold tracking-wide text-red-500">
                رزرو شده
              </span>
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}

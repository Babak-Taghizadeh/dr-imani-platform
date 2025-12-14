"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlotPickerSkeleton } from "@/components/booking/slot-picker-skeleton";
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
  console.log(slots);

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          variant={selectedTime === slot.time ? "default" : "outline"}
          disabled={!slot.available}
          onClick={() => slot.available && onSelect(slot.time)}
          className={cn(
            "h-12",
            !slot.available && "cursor-not-allowed opacity-50",
            selectedTime === slot.time && "bg-primary text-primary-foreground",
          )}
        >
          {toPersianNumber(slot.time)}
        </Button>
      ))}
    </div>
  );
}

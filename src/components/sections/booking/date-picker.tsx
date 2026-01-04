"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  useVisibleDates,
  type ShamsiDateInfo,
} from "@/hooks/use-visible-dates";
import { useDateAvailability } from "@/hooks/use-date-availability";
import { DatePickerButton } from "./date-picker-button";
import { DisabledDatesAlert } from "./disabled-dates-alert";

import type { TimeSlot } from "@/lib/booking-utils";

interface DatePickerProps {
  selectedDate?: string; // YYYY-MM-DD format (Gregorian)
  onSelect: (date: string, slots?: TimeSlot[]) => void; // Returns YYYY-MM-DD format (Gregorian) and optional cached slots
  disabledDates?: Array<{
    startDate: string;
    endDate: string;
    reason?: string | null;
  }>; // YYYY-MM-DD format (Gregorian)
  minDaysAhead?: number;
  maxDaysAhead?: number;
  appointmentType?: string; // Appointment type to check availability
}

export function DatePicker({
  selectedDate,
  onSelect,
  disabledDates = [],
  minDaysAhead = 0,
  maxDaysAhead = 30,
  appointmentType,
}: DatePickerProps) {
  const visibleDates = useVisibleDates({
    minDaysAhead,
    maxDaysAhead,
    disabledDates,
  });

  const datesWithAvailability = useDateAvailability({
    visibleDates,
    appointmentType,
  });

  const handleDateClick = useCallback(
    (dateInfo: ShamsiDateInfo) => {
      if (!dateInfo.isSelectable) {
        if (dateInfo.isHoliday) {
          toast.error("این تاریخ تعطیل است");
        } else {
          toast.error("این تاریخ قابل انتخاب نیست");
        }
        return;
      }
      // Check if date has available slots
      if (dateInfo.hasAvailableSlots === false) {
        toast.error("این تاریخ نوبت خالی ندارد");
        return;
      }
      // If still checking, wait
      if (dateInfo.isCheckingAvailability) {
        return;
      }
      // Pass the cached slots to avoid redundant API call
      onSelect(dateInfo.gregorianDateStr, dateInfo.slots);
    },
    [onSelect],
  );

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {datesWithAvailability.map((dateInfo) => {
          const isSelected = selectedDate === dateInfo.gregorianDateStr;
          const isDisabled =
            !dateInfo.isSelectable ||
            dateInfo.hasAvailableSlots === false ||
            !!dateInfo.isCheckingAvailability;

          return (
            <DatePickerButton
              key={dateInfo.gregorianDateStr}
              dateInfo={dateInfo}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onDateClick={handleDateClick}
            />
          );
        })}
      </div>
      <DisabledDatesAlert disabledDates={disabledDates} />
    </div>
  );
}

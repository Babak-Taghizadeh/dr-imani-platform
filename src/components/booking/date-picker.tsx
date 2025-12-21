"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jalaali from "jalaali-js";
import {
  toShamsi,
  getShamsiMonthName,
  getShamsiDayName,
} from "@/lib/shamsi-utils";
import { isIranianHoliday } from "@/lib/iranian-holidays";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DatePickerProps {
  selectedDate?: string; // YYYY-MM-DD format (Gregorian)
  onSelect: (date: string) => void; // Returns YYYY-MM-DD format (Gregorian)
  disabledDates?: Array<{
    startDate: string;
    endDate: string;
    reason?: string | null;
  }>; // YYYY-MM-DD format (Gregorian)
  minDaysAhead?: number;
  maxDaysAhead?: number;
}

interface ShamsiDateInfo {
  gregorianDate: Date; // For API calls
  gregorianDateStr: string; // YYYY-MM-DD format
  shamsiDateStr: string; // YYYY/MM/DD format
  shamsiDay: number;
  shamsiMonth: number;
  shamsiYear: number;
  monthName: string;
  dayName: string;
  isHoliday: boolean;
  isSelectable: boolean; // Can be selected (not disabled by any reason)
}

export function DatePicker({
  selectedDate,
  onSelect,
  disabledDates = [],
  minDaysAhead = 0,
  maxDaysAhead = 30,
}: DatePickerProps) {
  const [visibleDates, setVisibleDates] = useState<ShamsiDateInfo[]>([]);

  useEffect(() => {
    const today = startOfToday();
    const dates: ShamsiDateInfo[] = [];

    /**
     * Check if a date is on a working day (Saturday, Monday, Wednesday only)
     * Clinic is closed on Sunday, Tuesday, Thursday, Friday
     */
    const isWorkingDay = (date: Date): boolean => {
      const jsDay = date.getDay(); // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
      // Convert to Persian day: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
      const persianDay = jsDay === 6 ? 0 : jsDay + 1;
      // Working days: 0 (Saturday), 2 (Monday), 4 (Wednesday)
      // Don't show: 1 (Sunday), 3 (Tuesday), 5 (Thursday), 6 (Friday)
      return persianDay === 0 || persianDay === 2 || persianDay === 4;
    };

    /**
     * Check if a date is disabled by admin (disabledDates)
     */
    const isDisabledByAdmin = (dateStr: string): boolean => {
      return disabledDates.some((range) => {
        return dateStr >= range.startDate && dateStr <= range.endDate;
      });
    };

    /**
     * Check if a date is selectable (not disabled by any reason except admin)
     */
    const isSelectable = (dateInfo: {
      gregorianDateStr: string;
      gregorianDate: Date;
      isHoliday: boolean;
    }): boolean => {
      // Disable today
      if (dateInfo.gregorianDateStr === format(today, "yyyy-MM-dd")) {
        return false;
      }
      // Disable holidays
      if (dateInfo.isHoliday) {
        return false;
      }
      // This check is not needed here since we filter by isWorkingDay before creating dateInfo
      // But keeping it as a safety check
      if (!isWorkingDay(dateInfo.gregorianDate)) {
        return false;
      }
      return true;
    };

    // Start from tomorrow (minDaysAhead + 1) to exclude today
    const startDay = Math.max(minDaysAhead, 1);
    // Maximum days to search (prevent infinite loops) - approximately 2 months
    const maxSearchDays = Math.max(maxDaysAhead, 60);
    const targetAvailableDays = 7;

    // Loop until we have 7 available days or reach maxSearchDays
    for (
      let i = startDay;
      i <= maxSearchDays && dates.length < targetAvailableDays;
      i++
    ) {
      const gregorianDate = addDays(today, i);
      const gregorianDateStr = format(gregorianDate, "yyyy-MM-dd");

      // Only show working days (Saturday, Monday, Wednesday)
      if (!isWorkingDay(gregorianDate)) {
        continue; // Skip non-working days completely
      }

      // Skip admin-disabled dates completely (don't show them)
      if (isDisabledByAdmin(gregorianDateStr)) {
        continue;
      }

      // Get Shamsi date with Persian numerals for display
      const shamsiDateStr = toShamsi(gregorianDate);
      // Parse numeric values from gregorian date for calculations
      const jDate = jalaali.toJalaali(
        gregorianDate.getFullYear(),
        gregorianDate.getMonth() + 1,
        gregorianDate.getDate(),
      );
      const shamsiYear = jDate.jy;
      const shamsiMonth = jDate.jm;
      const shamsiDay = jDate.jd;

      const isHoliday = isIranianHoliday(gregorianDate);
      const selectable = isSelectable({
        gregorianDateStr,
        gregorianDate,
        isHoliday,
      });

      const dateInfo: ShamsiDateInfo = {
        gregorianDate,
        gregorianDateStr,
        shamsiDateStr,
        shamsiDay,
        shamsiMonth,
        shamsiYear,
        monthName: getShamsiMonthName(shamsiMonth),
        dayName: getShamsiDayName(gregorianDate),
        isHoliday,
        isSelectable: selectable,
      };

      // Only show available/selectable dates
      dates.push(dateInfo);
    }

    setVisibleDates(dates);
  }, [minDaysAhead, maxDaysAhead, disabledDates]);

  const handleDateClick = (dateInfo: ShamsiDateInfo) => {
    if (!dateInfo.isSelectable) {
      if (dateInfo.isHoliday) {
        toast.error("این تاریخ تعطیل است");
      } else {
        toast.error("این تاریخ قابل انتخاب نیست");
      }
      return;
    }
    onSelect(dateInfo.gregorianDateStr);
  };

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {visibleDates.map((dateInfo) => {
          const isSelected = selectedDate === dateInfo.gregorianDateStr;
          const isDisabled = !dateInfo.isSelectable;

          return (
            <Button
              key={dateInfo.gregorianDateStr}
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleDateClick(dateInfo)}
              disabled={isDisabled}
              className={cn(
                "relative h-auto flex-col p-2 sm:p-3",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                isDisabled && "cursor-not-allowed opacity-50 grayscale",
              )}
            >
              {dateInfo.isHoliday && (
                <span className="absolute top-1 left-1 text-[8px] text-orange-600 dark:text-orange-400">
                  ✨
                </span>
              )}
              <span
                className={cn(
                  "text-[10px] sm:text-xs",
                  isDisabled
                    ? "text-accent-foreground/50"
                    : "text-accent-foreground",
                  isSelected && "text-primary-foreground",
                )}
              >
                {dateInfo.dayName}
              </span>
              <span
                className={cn(
                  "text-base font-semibold sm:text-lg",
                  isDisabled && "text-accent-foreground/50",
                )}
              >
                {toPersianNumber(dateInfo.shamsiDay)}
              </span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs",
                  isDisabled
                    ? "text-accent-foreground/50"
                    : "text-accent-foreground",
                  isSelected && "text-primary-foreground",
                )}
              >
                {dateInfo.monthName}
              </span>
            </Button>
          );
        })}
      </div>
      {disabledDates.length > 0 && (
        <Alert className="mt-auto mb-1 bg-blue-950">
          <Info className="h-4 w-4" color="white" />
          <AlertTitle className="text-blue-50">
            اطلاعیه تعطیلی کلینیک
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-blue-100">
            <p className="text-sm">
              کلینیک در بازه‌های زمانی زیر تعطیل می‌باشد:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {disabledDates.map((range, index) => (
                <li key={index}>
                  <span className="font-medium">
                    {toShamsi(new Date(range.startDate))} تا{" "}
                    {toShamsi(new Date(range.endDate))}
                  </span>
                  {range.reason && (
                    <span className="mr-2 text-blue-100">({range.reason})</span>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

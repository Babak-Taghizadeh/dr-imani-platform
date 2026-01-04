import { useMemo } from "react";
import { format, addDays, startOfToday } from "date-fns";
import jalaali from "jalaali-js";
import {
  toShamsi,
  getShamsiMonthName,
  getShamsiDayName,
} from "@/lib/shamsi-utils";
import { isIranianHoliday } from "@/lib/iranian-holidays";
import { isAllowedBookingDay } from "@/lib/booking-utils";

import type { TimeSlot } from "@/lib/booking-utils";

export interface ShamsiDateInfo {
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
  hasAvailableSlots?: boolean; // Whether this date has any available time slots
  isCheckingAvailability?: boolean; // Whether we're currently checking availability
  slots?: TimeSlot[]; // Cached time slots from availability check
}

interface UseVisibleDatesParams {
  minDaysAhead?: number;
  maxDaysAhead?: number;
  disabledDates?: Array<{
    startDate: string;
    endDate: string;
    reason?: string | null;
  }>;
}

/**
 * Check if a date is disabled by admin (disabledDates)
 */
function isDisabledByAdmin(
  dateStr: string,
  disabledDates: Array<{ startDate: string; endDate: string }>,
): boolean {
  return disabledDates.some((range) => {
    return dateStr >= range.startDate && dateStr <= range.endDate;
  });
}

/**
 * Check if a date is selectable (not disabled by any reason except admin)
 */
function isSelectable(
  dateInfo: {
    gregorianDateStr: string;
    gregorianDate: Date;
    isHoliday: boolean;
  },
  todayStr: string,
): boolean {
  // Disable today
  if (dateInfo.gregorianDateStr === todayStr) {
    return false;
  }
  // Disable holidays
  if (dateInfo.isHoliday) {
    return false;
  }
  // This check is not needed here since we filter by isAllowedBookingDay before creating dateInfo
  // But keeping it as a safety check
  if (!isAllowedBookingDay(dateInfo.gregorianDate)) {
    return false;
  }
  return true;
}

export function useVisibleDates({
  minDaysAhead = 0,
  maxDaysAhead = 30,
  disabledDates = [],
}: UseVisibleDatesParams): ShamsiDateInfo[] {
  const visibleDates = useMemo(() => {
    const today = startOfToday();
    const todayStr = format(today, "yyyy-MM-dd");
    const dates: ShamsiDateInfo[] = [];

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
      if (!isAllowedBookingDay(gregorianDate)) {
        continue; // Skip non-working days completely
      }

      // Skip admin-disabled dates completely (don't show them)
      if (isDisabledByAdmin(gregorianDateStr, disabledDates)) {
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
      const selectable = isSelectable(
        {
          gregorianDateStr,
          gregorianDate,
          isHoliday,
        },
        todayStr,
      );

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
        hasAvailableSlots: undefined, // Will be checked separately
        isCheckingAvailability: false,
      };

      // Only show available/selectable dates
      dates.push(dateInfo);
    }

    return dates;
  }, [minDaysAhead, maxDaysAhead, disabledDates]);

  return visibleDates;
}

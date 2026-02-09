import jalaali from "jalaali-js";
import { toShamsi } from "./shamsi-utils";

/**
 * Iranian legal holidays (fixed dates in Shamsi calendar)
 * Format: { month: number, day: number }
 */
const FIXED_HOLIDAYS = [
  // Farvardin (1)
  { month: 1, day: 1 },
  { month: 1, day: 2 },
  { month: 1, day: 3 },
  { month: 1, day: 4 },
  { month: 1, day: 12 },
  { month: 1, day: 13 },
  { month: 1, day: 25 },

  // Ordibehesht (2)

  // Khordad (3)
  { month: 3, day: 6 },
  { month: 3, day: 14 },

  // Tir (4)
  { month: 4, day: 3 },
  { month: 4, day: 4 },

  // Mordad (5)
  { month: 5, day: 13 }, // Variable, approximate
  { month: 5, day: 21 }, // Variable, approximate
  { month: 5, day: 22 }, // Variable, approximate

  // Shahrivar (6)
  { month: 6, day: 8 },

  // Mehr (7)

  // Aban (8)

  // Azar (9)

  // Dey (10)
  { month: 10, day: 13 },
  { month: 10, day: 27 },

  // Bahman (11)
  { month: 11, day: 15 },
  { month: 11, day: 22 },

  // Esfand (12)
  { month: 12, day: 20 },
];

/**
 * Check if a date is a legal holiday
 * @param date - Date object (Gregorian)
 * @returns true if it's a holiday, false otherwise
 */
export function isIranianHoliday(date: Date): boolean {
  const jDate = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const month = jDate.jm;
  const day = jDate.jd;

  return FIXED_HOLIDAYS.some((h) => h.month === month && h.day === day);
}

/**
 * Get all holidays for a given year
 * @param year - Shamsi year
 * @returns Array of holiday dates in YYYY-MM-DD format (Gregorian)
 */
export function getHolidaysForYear(year: number): string[] {
  const holidays: string[] = [];

  FIXED_HOLIDAYS.forEach((holiday) => {
    try {
      const gregorian = jalaali.toGregorian(year, holiday.month, holiday.day);
      const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      holidays.push(dateStr);
    } catch {
      // Skip invalid dates
      console.warn(
        `Invalid holiday date: ${year}/${holiday.month}/${holiday.day}`,
      );
    }
  });

  return holidays;
}

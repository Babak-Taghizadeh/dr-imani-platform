import jalaali from "jalaali-js";
import { toPersianNumber } from "./persian-number-utils";

/**
 * Convert Gregorian date to Shamsi (Jalali) date string
 * @param date - Date object or date string in YYYY-MM-DD format
 * @returns Shamsi date string in YYYY/MM/DD format with Persian numerals
 */
export function toShamsi(date: Date | string): string {
  let dateObj: Date;
  if (typeof date === "string") {
    // Parse YYYY-MM-DD format and create date in local timezone
    const [year, month, day] = date.split("-").map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }
  const jDate = jalaali.toJalaali(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
  );
  const dateStr = `${jDate.jy}/${String(jDate.jm).padStart(2, "0")}/${String(jDate.jd).padStart(2, "0")}`;
  return toPersianNumber(dateStr);
}

/**
 * Convert Shamsi (Jalali) date string to Gregorian Date object
 * @param shamsiDate - Shamsi date string in YYYY/MM/DD format
 * @returns Date object
 */
export function fromShamsi(shamsiDate: string): Date {
  const [year, month, day] = shamsiDate.split("/").map(Number);
  const gDate = jalaali.toGregorian(year, month, day);
  return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
}

/**
 * Convert Shamsi date to Gregorian date string (YYYY-MM-DD)
 * @param shamsiDate - Shamsi date string in YYYY/MM/DD format
 * @returns Gregorian date string in YYYY-MM-DD format
 */
export function shamsiToGregorian(shamsiDate: string): string {
  const date = fromShamsi(shamsiDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get Shamsi month name
 */
export function getShamsiMonthName(month: number): string {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return months[month - 1] || "";
}

/**
 * Get Shamsi day name
 * JavaScript Date.getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
 * Persian week: Saturday=0, Sunday=1, ..., Friday=6
 */
export function getShamsiDayName(date: Date): string {
  const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
  // Convert JS day (0=Sun) to Persian day (0=Sat)
  const jsDay = date.getDay();
  const persianDay = jsDay === 6 ? 0 : jsDay + 1; // Saturday (6) -> 0, Sunday (0) -> 1, etc.
  return dayNames[persianDay];
}

/**
 * Get today's date in Shamsi format
 */
export function getTodayShamsi(): string {
  return toShamsi(new Date());
}

/**
 * Add days to a Shamsi date and return Shamsi date string
 */
export function addDaysToShamsi(shamsiDate: string, days: number): string {
  const gregorianDate = fromShamsi(shamsiDate);
  gregorianDate.setDate(gregorianDate.getDate() + days);
  return toShamsi(gregorianDate);
}


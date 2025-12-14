/**
 * Convert Latin digits (0-9) to Persian digits (۰-۹)
 * @param value - String or number to convert
 * @returns String with Persian digits
 */
export function toPersianNumber(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

import { format } from "date-fns";

/**
 * Format a date using date-fns format and convert to Persian numerals
 * @param date - Date object or date string
 * @param formatStr - Format string for date-fns format function
 * @returns Formatted date string with Persian numerals
 */
export function formatDatePersian(
  date: Date | string,
  formatStr: string,
): string {
  const formatted = format(
    typeof date === "string" ? new Date(date) : date,
    formatStr,
  );
  return toPersianNumber(formatted);
}

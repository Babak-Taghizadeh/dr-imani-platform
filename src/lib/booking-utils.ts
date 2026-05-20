import { format, addMinutes, isAfter, isBefore, isSameDay } from "date-fns";
import type { AppointmentType } from "@/types/types";

export const SLOT_INTERVAL_MINUTES = parseInt(
  process.env.SLOT_INTERVAL_MINUTES || "15",
  10,
);

export interface TimeSlot {
  time: string; // HH:mm format
  available: boolean;
}

/**
 * Generate all time slots for a given date and appointment type
 * @param date - The date for which to generate slots
 * @param appointmentType - The type of appointment (ONLINE_PHONE or IN_CLINIC)
 * @returns Array of time slots
 */
interface AppointmentTimeRange {
  startMinutes: number;
  endMinutes: number;
}

function getAppointmentTimeRange(
  date: Date,
  appointmentType?: AppointmentType,
): AppointmentTimeRange | null {
  const jsDay = date.getDay(); // JS: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

  if (appointmentType === "IN_CLINIC") {
    if (jsDay === 0) {
      // Sunday: 09:30 - 11:30 window, last start at 11:15
      return { startMinutes: 9 * 60 + 30, endMinutes: 11 * 60 + 15 };
    }
    if (jsDay === 1 || jsDay === 3) {
      // Monday/Wednesday: 15:00 - 17:00 window, last start at 16:45
      return { startMinutes: 15 * 60, endMinutes: 16 * 60 + 45 };
    }
    return null;
  }

  if (appointmentType === "ONLINE_PHONE") {
    if (jsDay === 0) {
      // Sunday: 11:30 - 12:30 window, last start at 12:15
      return { startMinutes: 11 * 60 + 30, endMinutes: 12 * 60 + 15 };
    }
    if (jsDay === 1 || jsDay === 3) {
      // Monday/Wednesday: 14:00 - 15:00 window, last start at 14:45
      return { startMinutes: 14 * 60, endMinutes: 14 * 60 + 45 };
    }
    return null;
  }

  return {
    startMinutes: 14 * 60,
    endMinutes: 18 * 60,
  };
}

export function generateTimeSlots(
  date: Date,
  appointmentType?: AppointmentType,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const range = getAppointmentTimeRange(date, appointmentType);

  if (!range) {
    return slots;
  }

  const startTime = new Date(date);
  startTime.setHours(
    Math.floor(range.startMinutes / 60),
    range.startMinutes % 60,
    0,
    0,
  );

  const endTime = new Date(date);
  endTime.setHours(
    Math.floor(range.endMinutes / 60),
    range.endMinutes % 60,
    0,
    0,
  );

  let currentTime = new Date(startTime);

  // Generate slots from start time to end time (inclusive) in 15-minute intervals
  while (true) {
    const currentTimeStr = format(currentTime, "HH:mm");
    const endTimeStr = format(endTime, "HH:mm");

    if (currentTimeStr <= endTimeStr) {
      slots.push({
        time: currentTimeStr,
        available: true,
      });
    }

    if (currentTimeStr >= endTimeStr) {
      break;
    }

    currentTime = addMinutes(currentTime, SLOT_INTERVAL_MINUTES);

    if (slots.length > 100) {
      break;
    }
  }

  return slots;
}

/**
 * Validate if a time slot is valid for a given appointment type
 * @param time - Time string in HH:mm format
 * @param appointmentType - The type of appointment
 * @param date - The appointment date used to determine the daily schedule
 * @returns true if the time is valid for the appointment type
 */
export function isValidTimeForAppointmentType(
  time: string,
  appointmentType: AppointmentType,
  date?: Date,
): boolean {
  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;

  const range = date
    ? getAppointmentTimeRange(date, appointmentType)
    : appointmentType === "ONLINE_PHONE"
      ? { startMinutes: 12 * 60, endMinutes: 13 * 60 + 45 }
      : appointmentType === "IN_CLINIC"
        ? { startMinutes: 14 * 60, endMinutes: 15 * 60 + 45 }
        : null;

  if (!range) {
    return false;
  }

  return (
    timeInMinutes >= range.startMinutes && timeInMinutes <= range.endMinutes
  );
}

/**
 * Check if a date is in a disabled date range
 */
export function isDateDisabled(
  date: Date,
  disabledRanges: Array<{ startDate: Date; endDate: Date }>,
): boolean {
  return disabledRanges.some((range) => {
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    return (
      (isAfter(date, start) || isSameDay(date, start)) &&
      (isBefore(date, end) || isSameDay(date, end))
    );
  });
}

/**
 * Format time string to Date object for a given date
 */
export function timeStringToDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Check if a date is on an allowed day for booking.
 * Persian week: Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6
 * Allowed: Sunday (1), Monday (2), Wednesday (4)
 * @param date - Date object to check
 * @returns true if the date is on an allowed day
 */
export function isAllowedBookingDay(date: Date): boolean {
  const jsDay = date.getDay(); // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to Persian day: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
  const persianDay = jsDay === 6 ? 0 : jsDay + 1;
  // Allowed days: 1 (Sunday), 2 (Monday), 4 (Wednesday)
  return persianDay === 1 || persianDay === 2 || persianDay === 4;
}

export function generatePaymentReference(appointmentId: string) {
  return `APT-${appointmentId.slice(0, 8)}-${Date.now()}`;
}

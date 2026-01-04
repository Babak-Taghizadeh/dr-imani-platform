import { format, addMinutes, isAfter, isBefore, isSameDay } from "date-fns";
import type { AppointmentType } from "@/types/types";

export const SLOT_START_HOUR = parseInt(
  process.env.SLOT_START_HOUR || "14",
  10,
);
export const SLOT_END_HOUR = parseInt(process.env.SLOT_END_HOUR || "18", 10);
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
export function generateTimeSlots(
  date: Date,
  appointmentType?: AppointmentType,
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  let startHour: number;
  let endHour: number;
  let endMinute: number;

  if (appointmentType === "ONLINE_PHONE") {
    // Online: 12:00 to 14:00 (last slot at 13:45)
    startHour = 12;
    endHour = 13;
    endMinute = 45;
  } else if (appointmentType === "IN_CLINIC") {
    // In-clinic: 14:00 to 16:00 (last slot at 15:45)
    startHour = 14;
    endHour = 15;
    endMinute = 45;
  } else {
    // Fallback to environment variables or defaults (for backward compatibility)
    startHour = SLOT_START_HOUR;
    endHour = SLOT_END_HOUR;
    endMinute = 0;
  }

  const startTime = new Date(date);
  startTime.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  let currentTime = new Date(startTime);

  // Generate slots from start time to end time (inclusive) in 15-minute intervals
  while (true) {
    const currentTimeStr = format(currentTime, "HH:mm");
    const endTimeStr = format(endTime, "HH:mm");

    // Add slot if it's within the valid range (inclusive of end time)
    if (currentTimeStr <= endTimeStr) {
      slots.push({
        time: currentTimeStr,
        available: true, // Will be updated based on availability
      });
    }

    // Stop if we've reached or passed the end time
    if (currentTimeStr >= endTimeStr) {
      break;
    }

    currentTime = addMinutes(currentTime, SLOT_INTERVAL_MINUTES);

    // Safety check to prevent infinite loops
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
 * @returns true if the time is valid for the appointment type
 */
export function isValidTimeForAppointmentType(
  time: string,
  appointmentType: AppointmentType,
): boolean {
  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;

  if (appointmentType === "ONLINE_PHONE") {
    // Online: 12:00 (720 minutes) to 13:45 (825 minutes)
    const startMinutes = 12 * 60; // 720
    const endMinutes = 13 * 60 + 45; // 825
    return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
  } else if (appointmentType === "IN_CLINIC") {
    // In-clinic: 14:00 (840 minutes) to 15:50 (950 minutes)
    const startMinutes = 14 * 60; // 840
    const endMinutes = 15 * 60 + 45; // 945
    return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
  }

  return false;
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
 * Get clinic timezone (default: Asia/Tehran)
 */
export function getClinicTimezone(): string {
  return process.env.CLINIC_TIMEZONE || "Asia/Tehran";
}

/**
 * Check if a date is on an allowed day for booking (even days including Saturday, but excluding Friday)
 * Persian week: Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6
 * Allowed: Saturday (0), Monday (2), Wednesday (4)
 * @param date - Date object to check
 * @returns true if the date is on an allowed day
 */
export function isAllowedBookingDay(date: Date): boolean {
  const jsDay = date.getDay(); // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to Persian day: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
  const persianDay = jsDay === 6 ? 0 : jsDay + 1;
  // Allowed days: 0 (Saturday), 2 (Monday), 4 (Wednesday) - excluding Friday (6)
  return persianDay === 0 || persianDay === 2 || persianDay === 4;
}

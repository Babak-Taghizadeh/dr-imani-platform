import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { appointments, disabledDates } from "@/db/schema";
import { eq, and, gte, lte, or, sql } from "drizzle-orm";
import { generateTimeSlots } from "@/lib/booking-utils";
import { parse, format } from "date-fns";
import type { AppointmentType } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const appointmentTypeParam = searchParams.get("appointmentType");

    if (!dateParam) {
      return NextResponse.json(
        { error: "پارامتر date الزامی است" },
        { status: 400 },
      );
    }

    if (!appointmentTypeParam) {
      return NextResponse.json(
        { error: "پارامتر appointmentType الزامی است" },
        { status: 400 },
      );
    }

    // Validate appointment type
    if (
      appointmentTypeParam !== "ONLINE_PHONE" &&
      appointmentTypeParam !== "IN_CLINIC"
    ) {
      return NextResponse.json(
        { error: "نوع نوبت نامعتبر است" },
        { status: 400 },
      );
    }

    const appointmentType = appointmentTypeParam as AppointmentType;

    const selectedDate = parse(dateParam, "yyyy-MM-dd", new Date());

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "فرمت تاریخ نامعتبر است" },
        { status: 400 },
      );
    }

    // Check if date is disabled
    const dateString = format(selectedDate, "yyyy-MM-dd");
    const disabledRanges = await db
      .select()
      .from(disabledDates)
      .where(
        and(
          lte(disabledDates.startDate, dateString),
          gte(disabledDates.endDate, dateString),
        ),
      );

    if (disabledRanges.length > 0) {
      // All slots are unavailable if date is disabled
      const slots = generateTimeSlots(selectedDate, appointmentType);
      return NextResponse.json({
        date: dateParam,
        slots: slots.map((slot) => ({ ...slot, available: false })),
      });
    }

    // Get booked appointments for this date and appointment type
    // Online and in-clinic appointments can have the same time without conflict
    // Only count PENDING and CONFIRMED appointments as booked
    const bookedAppointments = await db
      .select({
        time: sql<string>`to_char(${appointments.time}, 'HH24:MI')`.as("time"),
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.date, format(selectedDate, "yyyy-MM-dd")),
          eq(appointments.appointmentType, appointmentType),
          or(
            eq(appointments.status, "PENDING"),
            eq(appointments.status, "CONFIRMED"),
          ),
        ),
      );

    const bookedTimes = new Set(bookedAppointments.map((apt) => apt.time));

    // Generate slots and mark availability
    const slots = generateTimeSlots(selectedDate, appointmentType);
    const availableSlots = slots.map((slot) => ({
      ...slot,
      available: !bookedTimes.has(slot.time),
    }));

    return NextResponse.json({
      date: dateParam,
      slots: availableSlots,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت زمان‌های موجود رخ داد" },
      { status: 500 },
    );
  }
}

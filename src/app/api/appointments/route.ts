import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { calculatePrice } from "@/lib/price-calculator";
import {
  isAllowedBookingDay,
  isValidTimeForAppointmentType,
} from "@/lib/booking-utils";
import { isIranianHoliday } from "@/lib/iranian-holidays";
import { z } from "zod";
import { parse } from "date-fns";

interface DatabaseError extends Error {
  code?: string;
}

const createAppointmentSchema = z.object({
  appointmentType: z.enum(["ONLINE_PHONE", "IN_CLINIC"]),
  ageRange: z.enum(["UNDER_15", "OVER_15"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "فرمت زمان نامعتبر است"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Get appointments with pagination
    const userAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(eq(appointments.userId, userId));

    const total = totalCount[0]?.count || 0;

    return NextResponse.json({
      appointments: userAppointments.map((appointment) => ({
        ...appointment,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت نوبت‌ها رخ داد" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    // Calculate price
    const price = calculatePrice(validatedData.ageRange);

    // Validate date is not in the past or today
    const appointmentDate = parse(validatedData.date, "yyyy-MM-dd", new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate <= today) {
      return NextResponse.json(
        { error: "نمی‌توانید برای امروز یا تاریخ گذشته نوبت بگیرید" },
        { status: 400 },
      );
    }

    // Validate that the date is on an allowed day (even days including Saturday, but excluding Friday)
    if (!isAllowedBookingDay(appointmentDate)) {
      return NextResponse.json(
        {
          error:
            "نوبت‌گیری فقط در روزهای زوج (شنبه، دوشنبه، چهارشنبه) امکان‌پذیر است",
        },
        { status: 400 },
      );
    }

    // Validate that the date is not a holiday
    if (isIranianHoliday(appointmentDate)) {
      return NextResponse.json(
        { error: "نوبت‌گیری در روزهای تعطیل امکان‌پذیر نیست" },
        { status: 400 },
      );
    }

    // Validate that the time slot is valid for the appointment type
    if (
      !isValidTimeForAppointmentType(
        validatedData.time,
        validatedData.appointmentType,
      )
    ) {
      return NextResponse.json(
        {
          error:
            validatedData.appointmentType === "ONLINE_PHONE"
              ? "زمان انتخاب شده برای نوبت آنلاین معتبر نیست. زمان‌های مجاز: 12:00 تا 13:45"
              : "زمان انتخاب شده برای نوبت حضوری معتبر نیست. زمان‌های مجاز: 14:00 تا 17:45",
        },
        { status: 400 },
      );
    }

    // Check if slot is already booked for the same appointment type
    // Online and in-clinic appointments can have the same time without conflict
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.date, validatedData.date),
          eq(appointments.time, validatedData.time),
          eq(appointments.appointmentType, validatedData.appointmentType),
        ),
      )
      .limit(1);

    if (existingAppointment.length > 0) {
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است. لطفاً زمان دیگری انتخاب کنید" },
        { status: 409 },
      );
    }

    // Create appointment in transaction
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        userId,
        appointmentType: validatedData.appointmentType,
        ageRange: validatedData.ageRange,
        price,
        date: validatedData.date,
        time: validatedData.time,
        status: "PENDING",
      })
      .returning();

    return NextResponse.json(
      {
        message: "نوبت با موفقیت ایجاد شد",
        appointment: newAppointment,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست", details: error.errors },
        { status: 400 },
      );
    }

    // Check for unique constraint violation (double booking)
    const dbError = error as DatabaseError;
    if (dbError.code === "23505" || dbError.message?.includes("unique")) {
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است. لطفاً زمان دیگری انتخاب کنید" },
        { status: 409 },
      );
    }

    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "خطایی در ایجاد نوبت رخ داد" },
      { status: 500 },
    );
  }
}

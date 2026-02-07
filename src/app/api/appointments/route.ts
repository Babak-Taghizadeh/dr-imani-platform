import { NextRequest, NextResponse } from "next/server";
import { requireUser, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { calculatePrice } from "@/lib/price-calculator";
import {
  isAllowedBookingDay,
  isValidTimeForAppointmentType,
  generatePaymentReference,
} from "@/lib/booking-utils";
import { isIranianHoliday } from "@/lib/iranian-holidays";
import { z } from "zod";
import { parse } from "date-fns";
import { requestSEPToken, getSEPPaymentUrl } from "@/lib/sep-client";

interface DatabaseError extends Error {
  code?: string;
}

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID;
const SEP_CALLBACK_URL = process.env.SEP_CALLBACK_URL;

const createAppointmentSchema = z.object({
  appointmentType: z.enum(["ONLINE_PHONE", "IN_CLINIC"]),
  ageRange: z.enum(["UNDER_15", "OVER_15"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "فرمت زمان نامعتبر است"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser();
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
      .orderBy(desc(appointments.date), desc(appointments.time))
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
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت نوبت‌ها رخ داد" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
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

    // APPOINTMENT CREATION BLOCK END

    // ---- Payment initiation (moved from client) ----
    if (!SEP_TERMINAL_ID || !SEP_CALLBACK_URL) {
      return NextResponse.json(
        { error: "پیکربندی درگاه پرداخت کامل نیست" },
        { status: 500 },
      );
    }

    if (process.env.NODE_ENV === "production") {
      try {
        const callbackUrl = new URL(SEP_CALLBACK_URL);
        if (callbackUrl.protocol !== "https:") {
          console.error(
            "SEP_CALLBACK_URL must use HTTPS in production:",
            SEP_CALLBACK_URL,
          );
          return NextResponse.json(
            { error: "پیکربندی آدرس بازگشت پرداخت نامعتبر است" },
            { status: 500 },
          );
        }
      } catch {
        console.error("SEP_CALLBACK_URL is not a valid URL:", SEP_CALLBACK_URL);
        return NextResponse.json(
          { error: "پیکربندی آدرس بازگشت پرداخت نامعتبر است" },
          { status: 500 },
        );
      }
    }

    const paymentReference = generatePaymentReference(newAppointment.id);
    let paymentToken: string;

    await db.transaction(async (tx) => {
      await tx
        .update(appointments)
        .set({
          paymentReference,
          status: "PAYMENT_INITIATED",
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, newAppointment.id));

      const tokenResponse = await requestSEPToken({
        action: "token",
        TerminalId: SEP_TERMINAL_ID,
        Amount: newAppointment.price,
        ResNum: paymentReference,
        RedirectUrl: SEP_CALLBACK_URL,
      });

      if (tokenResponse.status !== 1 || !tokenResponse.token) {
        console.error("SEP token failed", {
          appointmentId: newAppointment.id,
          paymentReference,
          sepResponse: tokenResponse,
        });
        throw new Error(tokenResponse.errorDesc || "SEP token request failed");
      }

      paymentToken = tokenResponse.token;
    });

    // Return payment URL as JSON - token request already came from server IP
    // Client will handle redirect to payment gateway
    return NextResponse.json({
      paymentUrl: getSEPPaymentUrl(paymentToken!),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
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

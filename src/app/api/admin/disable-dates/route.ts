import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { disabledDates, appointments } from "@/db/schema";
import { and, gte, lte, eq } from "drizzle-orm";
import { z } from "zod";
import { parse, isAfter } from "date-fns";

const disableDatesSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = disableDatesSchema.parse(body);

    const startDate = parse(validatedData.startDate, "yyyy-MM-dd", new Date());
    const endDate = parse(validatedData.endDate, "yyyy-MM-dd", new Date());

    if (isAfter(startDate, endDate)) {
      return NextResponse.json(
        { error: "تاریخ شروع باید قبل از تاریخ پایان باشد" },
        { status: 400 },
      );
    }

    // Check for existing PAID appointments in this date range
    // (PENDING appointments will expire and be deleted, so we only check PAID)
    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.date, validatedData.startDate),
          lte(appointments.date, validatedData.endDate),
          eq(appointments.status, "PAID"),
        ),
      );

    // Create disabled date range
    const [disabledDate] = await db
      .insert(disabledDates)
      .values({
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        reason: validatedData.reason || null,
        createdBy: "admin",
      })
      .returning();

    return NextResponse.json(
      {
        message: "بازه تاریخ با موفقیت غیرفعال شد",
        disabledDate,
        warning:
          existingAppointments.length > 0
            ? `${existingAppointments.length} نوبت پرداخت شده در این بازه وجود دارد`
            : undefined,
      },
      { status: 201 },
    );
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

    console.error("Disable dates error:", error);
    return NextResponse.json(
      { error: "خطایی در غیرفعال کردن تاریخ رخ داد" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const disabledRanges = await db
      .select()
      .from(disabledDates)
      .orderBy(disabledDates.startDate);

    return NextResponse.json({ disabledDates: disabledRanges });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Get disabled dates error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت تاریخ‌های غیرفعال رخ داد" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check for existing CONFIRMED appointments in this date range
    // (PENDING appointments will expire and be deleted, so we only check CONFIRMED)
    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.date, validatedData.startDate),
          lte(appointments.date, validatedData.endDate),
          eq(appointments.status, "CONFIRMED"),
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
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const disabledRanges = await db
      .select()
      .from(disabledDates)
      .orderBy(disabledDates.startDate);

    return NextResponse.json({ disabledDates: disabledRanges });
  } catch (error) {
    console.error("Get disabled dates error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت تاریخ‌های غیرفعال رخ داد" },
      { status: 500 },
    );
  }
}

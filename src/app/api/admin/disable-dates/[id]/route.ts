import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { disabledDates, appointments } from "@/db/schema";
import { and, gte, lte, eq } from "drizzle-orm";
import { disableDatesSchema } from "@/lib/validation-schema";
import { parse, isAfter } from "date-fns";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
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

    // Check if the disabled date record exists
    const existingDisabledDate = await db
      .select()
      .from(disabledDates)
      .where(eq(disabledDates.id, id))
      .limit(1);

    if (existingDisabledDate.length === 0) {
      return NextResponse.json(
        { error: "بازه تاریخ یافت نشد" },
        { status: 404 },
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

    // Update disabled date range
    const [updatedDisabledDate] = await db
      .update(disabledDates)
      .set({
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        reason: validatedData.reason || null,
      })
      .where(eq(disabledDates.id, id))
      .returning();

    return NextResponse.json(
      {
        message: "بازه تاریخ با موفقیت به‌روزرسانی شد",
        disabledDate: updatedDisabledDate,
        warning:
          existingAppointments.length > 0
            ? `${existingAppointments.length} نوبت پرداخت شده در این بازه وجود دارد`
            : undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست" },
        { status: 400 },
      );
    }

    console.error("Update disabled date error:", error);
    return NextResponse.json(
      { error: "خطایی در به‌روزرسانی تاریخ رخ داد" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    // Check if the disabled date record exists
    const existingDisabledDate = await db
      .select()
      .from(disabledDates)
      .where(eq(disabledDates.id, id))
      .limit(1);

    if (existingDisabledDate.length === 0) {
      return NextResponse.json(
        { error: "بازه تاریخ یافت نشد" },
        { status: 404 },
      );
    }

    // Delete the disabled date record
    await db.delete(disabledDates).where(eq(disabledDates.id, id));

    return NextResponse.json(
      { message: "بازه تاریخ با موفقیت حذف شد" },
      { status: 200 },
    );
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Delete disabled date error:", error);
    return NextResponse.json(
      { error: "خطایی در حذف تاریخ رخ داد" },
      { status: 500 },
    );
  }
}

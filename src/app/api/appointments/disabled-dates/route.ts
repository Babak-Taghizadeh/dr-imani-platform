import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { disabledDates } from "@/db/schema";

/**
 * Public endpoint to get disabled date ranges
 * Used by booking form to show which dates are unavailable
 */
export async function GET() {
  try {
    const disabledRanges = await db
      .select({
        startDate: disabledDates.startDate,
        endDate: disabledDates.endDate,
        reason: disabledDates.reason,
      })
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

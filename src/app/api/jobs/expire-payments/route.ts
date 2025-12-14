import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";

const PAYMENT_TTL_MINUTES = parseInt(
  process.env.PAYMENT_TTL_MINUTES || "5",
  10,
);
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret if provided
    const authHeader = request.headers.get("authorization");
    if (CRON_SECRET) {
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Calculate expiry time threshold
    const expiryThreshold = new Date();
    expiryThreshold.setMinutes(
      expiryThreshold.getMinutes() - PAYMENT_TTL_MINUTES,
    );

    // Find expired PENDING appointments
    const expiredAppointments = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.status, "PENDING"),
          lt(appointments.createdAt, expiryThreshold),
        ),
      );

    if (expiredAppointments.length === 0) {
      return NextResponse.json({
        message: "No expired appointments found",
        expiredCount: 0,
      });
    }

    // Delete expired appointments (this frees up the slots)
    const deletedIds = expiredAppointments.map((apt) => apt.id);
    await db
      .delete(appointments)
      .where(
        and(
          eq(appointments.status, "PENDING"),
          lt(appointments.createdAt, expiryThreshold),
        ),
      );

    return NextResponse.json({
      message: "Expired appointments deleted",
      expiredCount: deletedIds.length,
      expiredIds: deletedIds,
    });
  } catch (error) {
    console.error("Expire payments job error:", error);
    return NextResponse.json(
      { error: "خطایی در پردازش نوبت‌های منقضی شده رخ داد" },
      { status: 500 },
    );
  }
}

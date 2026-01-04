import { NextRequest, NextResponse } from "next/server";
import { expirePendingAppointments } from "@/lib/expire-appointments";

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

    const result = await expirePendingAppointments();

    return NextResponse.json({
      message:
        result.expiredCount > 0
          ? "Expired appointments deleted"
          : "No expired appointments found",
      expiredCount: result.expiredCount,
      expiredIds: result.expiredIds,
    });
  } catch (error) {
    console.error("Expire payments job error:", error);
    return NextResponse.json(
      { error: "خطایی در پردازش نوبت‌های منقضی شده رخ داد" },
      { status: 500 },
    );
  }
}

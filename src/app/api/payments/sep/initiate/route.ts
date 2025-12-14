import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requestSEPToken, getSEPPaymentUrl } from "@/lib/sep-client";
import { z } from "zod";

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID || "";
const SEP_CALLBACK_URL =
  process.env.SEP_CALLBACK_URL ||
  `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/payments/sep/callback`;

const initiateSchema = z.object({
  appointmentId: z.string().uuid("شناسه نوبت نامعتبر است"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const validatedData = initiateSchema.parse(body);

    // Get appointment
    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, validatedData.appointmentId))
      .limit(1);

    if (appointmentData.length === 0) {
      return NextResponse.json({ error: "نوبت یافت نشد" }, { status: 404 });
    }

    const appointment = appointmentData[0];

    // Verify ownership
    if (appointment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if already confirmed
    if (appointment.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "این نوبت قبلاً پرداخت شده است" },
        { status: 400 },
      );
    }

    // Only allow payment for PENDING appointments
    if (appointment.status !== "PENDING") {
      return NextResponse.json(
        { error: "این نوبت در وضعیت نامعتبر است" },
        { status: 400 },
      );
    }

    if (!SEP_TERMINAL_ID) {
      return NextResponse.json(
        { error: "پیکربندی درگاه پرداخت کامل نیست" },
        { status: 500 },
      );
    }

    // Request token from SEP
    const tokenResponse = await requestSEPToken({
      Action: "token",
      TerminalId: SEP_TERMINAL_ID,
      Amount: appointment.price,
      ResNum: appointment.id,
      RedirectUrl: SEP_CALLBACK_URL,
    });

    if (tokenResponse.status !== 1 || !tokenResponse.token) {
      return NextResponse.json(
        {
          error: "خطا در ارتباط با درگاه پرداخت",
          details: tokenResponse.errorDesc || "خطای نامشخص",
        },
        { status: 500 },
      );
    }

    // Get payment URL
    const paymentUrl = getSEPPaymentUrl(tokenResponse.token);

    return NextResponse.json({
      paymentUrl,
      token: tokenResponse.token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Payment initiate error:", error);
    return NextResponse.json(
      { error: "خطایی در شروع پرداخت رخ داد" },
      { status: 500 },
    );
  }
}

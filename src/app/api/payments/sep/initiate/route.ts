import { NextRequest, NextResponse } from "next/server";
import { requireUser, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requestSEPToken, getSEPPaymentUrl } from "@/lib/sep-client";
import { z } from "zod";

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID;
const SEP_CALLBACK_URL = process.env.SEP_CALLBACK_URL;
const initiateSchema = z.object({
  appointmentId: z.string().uuid("شناسه نوبت نامعتبر است"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
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

    if (!SEP_TERMINAL_ID || !SEP_CALLBACK_URL) {
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
      // TODO: CONSIDER ADDING UNIQUE IDS ON EVERY REDIRECT DUE TO SEP REQUIREMENTS
      RedirectUrl: SEP_CALLBACK_URL,
    });

    if (tokenResponse.status !== 1 || !tokenResponse.token) {
      // TODO: CONSIDER ONLY LOGGING THE ERROR WHEN RESPONSE CODE IS -1
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
      // TODO: TOKEN IS NOT REQUIRED ON FRONT SIDE
      token: tokenResponse.token,
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

    console.error("Payment initiate error:", error);
    return NextResponse.json(
      { error: "خطایی در شروع پرداخت رخ داد" },
      { status: 500 },
    );
  }
}

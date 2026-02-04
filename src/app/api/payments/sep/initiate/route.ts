import { NextRequest, NextResponse } from "next/server";
import { requireUser, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requestSEPToken, getSEPPaymentUrl } from "@/lib/sep-client";
import { z } from "zod";
import { generatePaymentReference } from "@/lib/booking-utils";

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
    const { appointmentId } = initiateSchema.parse(body);

    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    const appointment = appointmentData[0];

    if (!appointment) {
      return NextResponse.json({ error: "نوبت یافت نشد" }, { status: 404 });
    }

    if (appointment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (appointment.status !== "PENDING") {
      return NextResponse.json(
        { error: "این نوبت در وضعیت قابل پرداخت نیست" },
        { status: 400 },
      );
    }

    if (!SEP_TERMINAL_ID || !SEP_CALLBACK_URL) {
      return NextResponse.json(
        { error: "پیکربندی درگاه پرداخت کامل نیست" },
        { status: 500 },
      );
    }

    const paymentReference = generatePaymentReference(appointment.id);

    let paymentToken: string;

    await db.transaction(async (tx) => {
      // 1. قفل منطقی نوبت
      await tx
        .update(appointments)
        .set({
          paymentReference,
          status: "PAYMENT_INITIATED",
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, appointment.id));

      console.log("token body", SEP_TERMINAL_ID, appointment.price, paymentReference, SEP_CALLBACK_URL);
      // 2. درخواست توکن
      const tokenResponse = await requestSEPToken({
        action: "token",
        TerminalId: SEP_TERMINAL_ID,
        Amount: appointment.price,
        ResNum: paymentReference,
        RedirectUrl: SEP_CALLBACK_URL,
      });



      // 3. fail → rollback
      if (tokenResponse.status !== 1 || !tokenResponse.token) {
        console.error("SEP token failed", {
          appointmentId: appointment.id,
          paymentReference,
          sepResponse: tokenResponse,
        });
        throw new Error(tokenResponse.errorDesc || "SEP token request failed");
      }

      paymentToken = tokenResponse.token;
    });

    // 4. redirect
    return NextResponse.json({
      paymentUrl: getSEPPaymentUrl(paymentToken!),
    });
  } catch (error) {
    if (isAuthError(error)) return error.response;

    console.error("Payment initiate error:", error);
    return NextResponse.json({ error: "خطا در شروع پرداخت" }, { status: 500 });
  }
}

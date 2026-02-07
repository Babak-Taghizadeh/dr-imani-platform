import { NextRequest, NextResponse } from "next/server";
import { requireUser, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requestSEPToken, getSEPPaymentUrl } from "@/lib/sep-client";
import { z } from "zod";
import { generatePaymentReference } from "@/lib/booking-utils";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID;
const SEP_CALLBACK_URL = process.env.SEP_CALLBACK_URL;
const initiateSchema = z.object({
  appointmentId: z.string().uuid("شناسه نوبت نامعتبر است"),
});
export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const userId = session.user.id;

    // Basic rate limiting per client IP to protect the payment initiation endpoint
    const clientIp = getClientIP(request);
    const rateKey = `payment-init:${clientIp}`;
    const { allowed } = checkRateLimit(rateKey, RATE_LIMITS.PAYMENT_INIT);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "تعداد درخواست‌های پرداخت شما بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
        },
        { status: 429 },
      );
    }
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

    // Fetch user's phone number
    const userData = await db
      .select({ phoneNumber: users.phoneNumber })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const userPhoneNumber = userData[0].phoneNumber;

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
      // 2. درخواست توکن
      const tokenResponse = await requestSEPToken({
        action: "token",
        TerminalId: SEP_TERMINAL_ID,
        Amount: appointment.price,
        ResNum: paymentReference,
        RedirectUrl: SEP_CALLBACK_URL,
        CellNumber: userPhoneNumber,
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

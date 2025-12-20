import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { appointments, paymentLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySEPTransaction } from "@/lib/sep-client";

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID || "";

interface PaymentErrorData {
  state?: string;
  status?: string;
  amount?: string;
  terminalId?: string;
  verifyError?: string;
}

// SEP callback can be POST or GET (based on GetMethod parameter)
export async function POST(request: NextRequest) {
  return handleCallback(request);
}

export async function GET(request: NextRequest) {
  return handleCallback(request);
}

async function handleCallback(request: NextRequest) {
  try {
    // Get callback parameters (from POST body or GET query)
    let params: Record<string, string> = {};

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        for (const [key, value] of formData.entries()) {
          params[key] = String(value);
        }
      } catch {
        // If formData fails, try JSON
        try {
          params = await request.json();
        } catch {
          // Fallback to empty
        }
      }
    } else {
      // GET request - use search params
      request.nextUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    const getParam = (key: string): string | null => {
      return params[key] || null;
    };

    const state = getParam("State");
    const status = getParam("Status");
    const refNum = getParam("RefNum");
    const resNum = getParam("ResNum");
    const amount = getParam("Amount");
    const terminalId = getParam("TerminalId");

    // Validate required parameters
    if (!refNum || !resNum || !amount || !state || !status) {
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("پارامترهای پرداخت نامعتبر است")}`,
          request.url,
        ),
      );
    }

    // State=OK means payment was successful
    if (state !== "OK" || status !== "2") {
      // Payment failed or canceled
      await handleFailedPayment(resNum, refNum, {
        state: state ?? undefined,
        status: status ?? undefined,
        amount: amount ?? undefined,
        terminalId: terminalId ?? undefined,
      });

      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("پرداخت ناموفق بود")}`,
          request.url,
        ),
      );
    }

    // Verify transaction with SEP
    const verifyResponse = await verifySEPTransaction({
      RefNum: refNum,
      TerminalNumber: parseInt(SEP_TERMINAL_ID, 10),
    });

    if (!verifyResponse.Success || verifyResponse.ResultCode !== 0) {
      await handleFailedPayment(resNum, refNum, {
        state: state ?? undefined,
        status: status ?? undefined,
        amount: amount ?? undefined,
        terminalId: terminalId ?? undefined,
        verifyError: verifyResponse.ResultDescription,
      });

      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent(verifyResponse.ResultDescription || "تایید پرداخت ناموفق بود")}`,
          request.url,
        ),
      );
    }

    // Get appointment
    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, resNum))
      .limit(1);

    if (appointmentData.length === 0) {
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("نوبت یافت نشد")}`,
          request.url,
        ),
      );
    }

    const appointment = appointmentData[0];

    // Check if already processed (idempotency)
    const existingPayment = await db
      .select()
      .from(paymentLogs)
      .where(eq(paymentLogs.gatewayReference, refNum))
      .limit(1);

    if (existingPayment.length > 0) {
      // Already processed, redirect to success
      return NextResponse.redirect(
        new URL(`/appointments/${appointment.id}`, request.url),
      );
    }

    // Verify amount matches
    const verifiedAmount = verifyResponse.TransactionDetail?.OrginalAmount || 0;
    if (verifiedAmount !== appointment.price) {
      await handleFailedPayment(resNum, refNum, {
        state: state ?? undefined,
        status: status ?? undefined,
        amount: amount ?? undefined,
        terminalId: terminalId ?? undefined,
        verifyError: `مبلغ پرداختی (${verifiedAmount}) با مبلغ نوبت (${appointment.price}) مطابقت ندارد`,
      });

      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("مبلغ پرداختی با مبلغ نوبت مطابقت ندارد")}`,
          request.url,
        ),
      );
    }

    // Update appointment status
    await db
      .update(appointments)
      .set({
        status: "CONFIRMED",
        paymentReference: refNum,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, appointment.id));

    // Create payment log
    await db.insert(paymentLogs).values({
      appointmentId: appointment.id,
      amount: verifiedAmount,
      gateway: "SEP",
      gatewayReference: refNum,
      status: "SUCCESS",
      rawPayload: {
        state,
        status,
        refNum,
        resNum,
        amount,
        terminalId,
        verifyResponse,
      },
    });

    // Redirect to appointment detail page
    return NextResponse.redirect(
      new URL(`/appointments/${appointment.id}?payment=success`, request.url),
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/booking/payment/failure?error=${encodeURIComponent("خطایی در پردازش پرداخت رخ داد")}`,
        request.url,
      ),
    );
  }
}

async function handleFailedPayment(
  resNum: string,
  refNum: string,
  errorData: PaymentErrorData,
) {
  try {
    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, resNum))
      .limit(1);

    if (appointmentData.length > 0) {
      const appointment = appointmentData[0];

      // Create failed payment log
      await db.insert(paymentLogs).values({
        appointmentId: appointment.id,
        amount: parseInt(errorData.amount || "0", 10),
        gateway: "SEP",
        gatewayReference: refNum || "unknown",
        status: "FAILED",
        rawPayload: errorData,
      });
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

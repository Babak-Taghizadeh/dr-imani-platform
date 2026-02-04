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
  // Get callback parameters (from POST body or GET query)
  let params: Record<string, string> = {};
  let resNum: string | null = null;

  try {
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
    resNum = getParam("ResNum");
    const amount = getParam("Amount");
    const terminalId = getParam("TerminalId");

    // Validate required parameters (including empty string check)
    if (
      !refNum ||
      !resNum ||
      !amount ||
      !state ||
      !status ||
      refNum.trim() === "" ||
      resNum.trim() === ""
    ) {
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("پارامترهای پرداخت نامعتبر است")}`,
          request.url,
        ),
      );
    }

    // Validate terminal ID matches expected
    if (terminalId && terminalId !== SEP_TERMINAL_ID) {
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("ترمینال نامعتبر است")}`,
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
          `/booking/payment/failure?error=${encodeURIComponent("پرداخت ناموفق بود")}&appointmentId=${encodeURIComponent(resNum)}`,
          request.url,
        ),
      );
    }

    // Verify transaction with SEP
    const verifyResponse = await verifySEPTransaction({
      RefNum: refNum,
      TerminalNumber: parseInt(SEP_TERMINAL_ID, 10),
    });

    // Handle verify response
    // ResultCode 0 = success, 2 = duplicate request (also acceptable as idempotent)
    // Other codes indicate errors
    if (
      !verifyResponse.Success ||
      (verifyResponse.ResultCode !== 0 && verifyResponse.ResultCode !== 2)
    ) {
      await handleFailedPayment(resNum, refNum, {
        state: state ?? undefined,
        status: status ?? undefined,
        amount: amount ?? undefined,
        terminalId: terminalId ?? undefined,
        verifyError: verifyResponse.ResultDescription,
      });

      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent(verifyResponse.ResultDescription || "تایید پرداخت ناموفق بود")}&appointmentId=${encodeURIComponent(resNum)}`,
          request.url,
        ),
      );
    }

    // Get appointment
    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.paymentReference, resNum))
      .limit(1);

    if (appointmentData.length === 0) {
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("نوبت یافت نشد")}&appointmentId=${encodeURIComponent(resNum)}`,
          request.url,
        ),
      );
    }

    const appointment = appointmentData[0];

    // Verify appointment is still in PENDING status
    if (appointment.status !== "PENDING") {
      // If already paid with the same RefNum, redirect to success (idempotent)
      if (
        appointment.status === "PAID" &&
        appointment.sepRefNum === refNum
      ) {
        return NextResponse.redirect(
          new URL(`/appointments/${appointment.id}`, request.url),
        );
      }
      // Otherwise, status is invalid
      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("نوبت در وضعیت نامعتبر است")}&appointmentId=${encodeURIComponent(appointment.id)}`,
          request.url,
        ),
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
          `/booking/payment/failure?error=${encodeURIComponent("مبلغ پرداختی با مبلغ نوبت مطابقت ندارد")}&appointmentId=${encodeURIComponent(appointment.id)}`,
          request.url,
        ),
      );
    }

    // Validate TerminalNumber from verify response matches expected
    const verifiedTerminal = verifyResponse.TransactionDetail?.TerminalNumber;
    if (
      verifiedTerminal &&
      verifiedTerminal !== parseInt(SEP_TERMINAL_ID, 10)
    ) {
      await handleFailedPayment(resNum, refNum, {
        state: state ?? undefined,
        status: status ?? undefined,
        amount: amount ?? undefined,
        terminalId: terminalId ?? undefined,
        verifyError: "ترمینال تایید شده با ترمینال انتظاری مطابقت ندارد",
      });

      return NextResponse.redirect(
        new URL(
          `/booking/payment/failure?error=${encodeURIComponent("ترمینال تایید شده نامعتبر است")}&appointmentId=${encodeURIComponent(appointment.id)}`,
          request.url,
        ),
      );
    }

    // Use transaction to ensure atomicity and prevent race conditions
    let paymentAlreadyExists = false;
    try {
      await db.transaction(async (tx) => {
        // Double-check locking: Check again inside transaction
        const existingPayment = await tx
          .select()
          .from(paymentLogs)
          .where(eq(paymentLogs.gatewayReference, refNum))
          .limit(1);

        if (existingPayment.length > 0) {
          // Already processed, mark as existing and return early
          paymentAlreadyExists = true;
          return;
        }

        // Update appointment status
        await tx
          .update(appointments)
          .set({
            status: "PAID",
            sepRefNum: refNum,
            paymentVerifiedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(appointments.id, appointment.id));

        // Create payment log (unique constraint will prevent duplicates)
        await tx.insert(paymentLogs).values({
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
      });

      // If payment was already processed (idempotent), redirect to success
      if (paymentAlreadyExists) {
        return NextResponse.redirect(
          new URL(`/appointments/${appointment.id}`, request.url),
        );
      }
    } catch (error) {
      // If unique constraint violation (double payment attempt), redirect to success
      if (
        error instanceof Error &&
        (error.message.includes("unique") ||
          error.message.includes("duplicate") ||
          error.message.includes("violates unique constraint"))
      ) {
        // Payment already processed, redirect to success (idempotent)
        return NextResponse.redirect(
          new URL(`/appointments/${appointment.id}`, request.url),
        );
      }
      // Other transaction errors
      throw error;
    }

    // Redirect to success page with appointment ID
    return NextResponse.redirect(
      new URL(
        `/booking/payment/success?appointmentId=${encodeURIComponent(appointment.id)}`,
        request.url,
      ),
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    const appointmentIdParam = resNum
      ? `&appointmentId=${encodeURIComponent(resNum)}`
      : "";
    return NextResponse.redirect(
      new URL(
        `/booking/payment/failure?error=${encodeURIComponent("خطایی در پردازش پرداخت رخ داد")}${appointmentIdParam}`,
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
      .where(eq(appointments.paymentReference, resNum))
      .limit(1);

    if (appointmentData.length > 0) {
      const appointment = appointmentData[0];

      // Create failed payment log
      // Use a unique reference for failed payments to avoid constraint violations
      const failedRefNum = refNum || `failed-${Date.now()}-${Math.random()}`;
      await db.insert(paymentLogs).values({
        appointmentId: appointment.id,
        amount: parseInt(errorData.amount || "0", 10) || 0,
        gateway: "SEP",
        gatewayReference: failedRefNum,
        status: "FAILED",
        rawPayload: {
          ...errorData,
          refNum: refNum || undefined,
          resNum: resNum || undefined,
        },
      });
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

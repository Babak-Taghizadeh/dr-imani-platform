import { db } from "@/db/db";
import { paymentLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export interface PaymentTransactionInfo {
    id: string;
    amount: number;
    gateway: string;
    gatewayReference: string;
    status: "SUCCESS" | "FAILED";
    createdAt: string;
    rawPayload: {
        state?: string;
        status?: string;
        refNum?: string;
        resNum?: string;
        amount?: string;
        terminalId?: string;
        verifyError?: string;
        verifyResponse?: {
            TransactionDetail?: {
                RRN?: string;
                RefNum?: string;
                MaskedPan?: string;
                HashedPan?: string;
                TerminalNumber?: number;
                OrginalAmount?: number;
                AffectiveAmount?: number;
                StraceDate?: string;
                StraceNo?: string;
            };
            ResultCode?: number;
            ResultDescription?: string;
            Success?: boolean;
        };
    } | null;
}

/**
 * Get the latest payment log for an appointment
 */
export async function getPaymentLogByAppointmentId(
    appointmentId: string,
): Promise<PaymentTransactionInfo | null> {
    const paymentData = await db
        .select()
        .from(paymentLogs)
        .where(eq(paymentLogs.appointmentId, appointmentId))
        .orderBy(desc(paymentLogs.createdAt))
        .limit(1);

    if (paymentData.length === 0) {
        return null;
    }

    const payment = paymentData[0];
    return {
        id: payment.id,
        amount: payment.amount,
        gateway: payment.gateway,
        gatewayReference: payment.gatewayReference,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
        rawPayload: payment.rawPayload as PaymentTransactionInfo["rawPayload"],
    };
}


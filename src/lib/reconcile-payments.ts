import { db } from "@/db/db";
import { appointments, paymentLogs } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { verifySEPTransaction } from "./sep-client";

const SEP_TERMINAL_ID = process.env.SEP_TERMINAL_ID || "";

/**
 * Reconciles payment edge cases:
 * 1. Appointments with paymentReference but status still PENDING
 * 2. Verifies and updates if payment was successful
 */
export async function reconcilePayments() {
    try {
        if (!SEP_TERMINAL_ID) {
            console.warn("SEP_TERMINAL_ID not configured, skipping reconciliation");
            return { reconciledCount: 0, reconciledIds: [] };
        }

        // Find appointments with paymentReference but status still PENDING
        // This shouldn't happen, but could in edge cases (race conditions, errors)
        const appointmentsToReconcile = await db
            .select({
                id: appointments.id,
                paymentReference: appointments.paymentReference,
                price: appointments.price,
            })
            .from(appointments)
            .where(
                and(
                    eq(appointments.status, "PENDING"),
                    isNotNull(appointments.paymentReference),
                ),
            );

        if (appointmentsToReconcile.length === 0) {
            return { reconciledCount: 0, reconciledIds: [] };
        }

        const reconciledIds: string[] = [];

        for (const appointment of appointmentsToReconcile) {
            const paymentReference = appointment.paymentReference;
            if (!paymentReference) continue;

            try {
                // Attempt to verify the payment
                const verifyResponse = await verifySEPTransaction({
                    RefNum: paymentReference,
                    TerminalNumber: parseInt(SEP_TERMINAL_ID, 10),
                });

                // If verification succeeds and amount matches, update appointment
                const transactionDetail = verifyResponse.TransactionDetail;
                if (
                    verifyResponse.Success &&
                    verifyResponse.ResultCode === 0 &&
                    transactionDetail &&
                    transactionDetail.OrginalAmount === appointment.price
                ) {
                    // Check if payment log already exists
                    const existingPayment = await db
                        .select()
                        .from(paymentLogs)
                        .where(eq(paymentLogs.gatewayReference, paymentReference))
                        .limit(1);

                    await db.transaction(async (tx) => {
                        // Update appointment status
                        await tx
                            .update(appointments)
                            .set({
                                status: "CONFIRMED",
                                updatedAt: new Date(),
                            })
                            .where(eq(appointments.id, appointment.id));

                        // Create payment log if it doesn't exist
                        if (existingPayment.length === 0) {
                            await tx.insert(paymentLogs).values({
                                appointmentId: appointment.id,
                                amount: transactionDetail.OrginalAmount,
                                gateway: "SEP",
                                gatewayReference: paymentReference,
                                status: "SUCCESS",
                                rawPayload: {
                                    reconciled: true,
                                    verifyResponse,
                                },
                            });
                        }
                    });

                    reconciledIds.push(appointment.id);
                    console.log(
                        `Reconciled appointment ${appointment.id} with payment ${paymentReference}`,
                    );
                }
            } catch (error) {
                console.error(
                    `Failed to reconcile appointment ${appointment.id}:`,
                    error,
                );
                // Continue with other appointments
            }
        }

        return {
            reconciledCount: reconciledIds.length,
            reconciledIds,
        };
    } catch (error) {
        console.error("Payment reconciliation job error:", error);
        throw error;
    }
}


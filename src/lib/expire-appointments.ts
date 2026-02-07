import { db } from "@/db/db";
import { appointments } from "@/db/schema";
import { eq, and, lt, or } from "drizzle-orm";

// Default to 40 minutes to account for:
// - SEP token expiry (20 minutes default)
// - Payment processing time
// - 30-minute verification window after payment
// This ensures we don't expire appointments while payment is still possible
const PAYMENT_TTL_MINUTES = parseInt(
  process.env.PAYMENT_TTL_MINUTES || "40",
  10,
);

export async function expirePendingAppointments() {
  try {
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
          lt(appointments.createdAt, expiryThreshold),
          or(
            eq(appointments.status, "PENDING"),
            eq(appointments.status, "PAYMENT_INITIATED"),
          ),
        ),
      );

    if (expiredAppointments.length === 0) {
      return { expiredCount: 0, expiredIds: [] };
    }

    // Delete expired appointments (this frees up the slots)
    const deletedIds = expiredAppointments.map((apt) => apt.id);
    await db
      .delete(appointments)
      .where(
        and(
          lt(appointments.createdAt, expiryThreshold),
          or(
            eq(appointments.status, "PENDING"),
            eq(appointments.status, "PAYMENT_INITIATED"),
          ),
        ),
      );

    console.log(
      `Expired ${deletedIds.length} PENDING appointment(s):`,
      deletedIds,
    );
    return { expiredCount: deletedIds.length, expiredIds: deletedIds };
  } catch (error) {
    console.error("Expire appointments job error:", error);
    throw error;
  }
}

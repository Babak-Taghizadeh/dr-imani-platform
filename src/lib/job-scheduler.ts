import cron from "node-cron";
import { expirePendingAppointments } from "./expire-appointments";
import { reconcilePayments } from "./reconcile-payments";

let isInitialized = false;

/**
 * Starts the in-app job scheduler using node-cron.
 * 
 * IMPORTANT: This only works in traditional VPS deployments where the Next.js
 * process runs continuously. It will NOT work in:
 * - Serverless environments (Vercel, AWS Lambda, etc.)
 * - Edge runtime
 * 
 * For production, especially on VPS, it's recommended to use system cron
 * instead by setting USE_VPS_CRON=true and calling the API endpoints:
 * - POST /api/jobs/expire-payments
 * - POST /api/jobs/reconcile-payments
 * 
 * To disable in-app scheduler, set USE_VPS_CRON=true in your environment.
 */
export function startJobScheduler() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  // If VPS cron is enabled, skip in-app scheduler
  if (process.env.USE_VPS_CRON === "true") {
    console.log("Job scheduler: Using VPS cron (in-app scheduler disabled)");
    return;
  }

  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV === "development" && !process.env.ENABLE_JOBS) {
    console.log("Job scheduler disabled in development (set ENABLE_JOBS=true to enable)");
    return;
  }

  // Job 1: Expire pending appointments (runs every 5 minutes)
  // This frees up appointment slots that weren't paid in time
  cron.schedule("*/5 * * * *", async () => {
    try {
      await expirePendingAppointments();
    } catch (error) {
      console.error("Expire appointments job error:", error);
    }
  });

  // Job 2: Reconcile payments (runs every 10 minutes)
  // Handles edge cases where paymentReference exists but status is still PENDING
  cron.schedule("*/10 * * * *", async () => {
    try {
      await reconcilePayments();
    } catch (error) {
      console.error("Payment reconciliation job error:", error);
    }
  });

  isInitialized = true;
  console.log("In-app job scheduler started:");
  console.log("  - Expire appointments: every 5 minutes");
  console.log("  - Reconcile payments: every 10 minutes");
  console.log("  Note: For production VPS, consider using system cron with USE_VPS_CRON=true");
}

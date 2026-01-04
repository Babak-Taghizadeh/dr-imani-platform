import cron from "node-cron";
import { expirePendingAppointments } from "./expire-appointments";

let isInitialized = false;

export function startJobScheduler() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV === "development" && !process.env.ENABLE_JOBS) {
    console.log("Job scheduler disabled in development");
    return;
  }

  // Run every minute: * * * * *
  // You can adjust: every 5 minutes would be: */5 * * * *
  cron.schedule("* * * * *", async () => {
    try {
      await expirePendingAppointments();
    } catch (error) {
      console.error("Scheduled job error:", error);
    }
  });

  isInitialized = true;
  console.log("Job scheduler started: expire appointments every minute");
}

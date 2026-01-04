export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startJobScheduler } = await import("./lib/job-scheduler");
    startJobScheduler();
  }
}

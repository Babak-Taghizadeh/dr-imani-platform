import { NextRequest, NextResponse } from "next/server";
import { reconcilePayments } from "@/lib/reconcile-payments";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        if (process.env.NODE_ENV === "production") {
            if (!CRON_SECRET) {
                console.error("CRON_SECRET is not configured in production");
                return NextResponse.json(
                    { error: "Server cron configuration error" },
                    { status: 500 },
                );
            }
            if (authHeader !== `Bearer ${CRON_SECRET}`) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        } else if (CRON_SECRET) {
            // In non-production, only enforce auth if a secret is configured
            if (authHeader !== `Bearer ${CRON_SECRET}`) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const result = await reconcilePayments();

        return NextResponse.json({
            message:
                result.reconciledCount > 0
                    ? "Payments reconciled"
                    : "No payments to reconcile",
            reconciledCount: result.reconciledCount,
            reconciledIds: result.reconciledIds,
        });
    } catch (error) {
        console.error("Reconcile payments job error:", error);
        return NextResponse.json(
            { error: "خطایی در تطبیق پرداخت‌ها رخ داد" },
            { status: 500 },
        );
    }
}


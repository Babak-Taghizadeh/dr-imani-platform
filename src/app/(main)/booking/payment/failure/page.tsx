import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { getPaymentLogByAppointmentId } from "@/utils/payment-services";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { formatDatePersian } from "@/lib/persian-number-utils";
import { Separator } from "@/components/ui/separator";

interface PaymentFailurePageProps {
  searchParams: Promise<{ error?: string; appointmentId?: string }>;
}

export default async function PaymentFailurePage({
  searchParams,
}: PaymentFailurePageProps) {
  const params = await searchParams;
  const error = params.error;
  const appointmentId = params.appointmentId;

  let paymentInfo = null;
  if (appointmentId) {
    paymentInfo = await getPaymentLogByAppointmentId(appointmentId);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="border-red-500">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <XCircle className="h-6 w-6" />
            <CardTitle>پرداخت ناموفق</CardTitle>
          </div>
          <CardDescription>متأسفانه پرداخت انجام نشد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 rounded-lg border p-4">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                  {decodeURIComponent(error)}
                </p>
              </div>
            )}
            <p className="text-accent-foreground">
              لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
            </p>

            {paymentInfo && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">اطلاعات تراکنش</h3>
                  <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
                    {paymentInfo.amount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          مبلغ درخواستی:
                        </span>
                        <span className="font-semibold">
                          {paymentInfo.amount.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    )}

                    {paymentInfo.gatewayReference && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره پیگیری:
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {paymentInfo.gatewayReference}
                        </span>
                      </div>
                    )}

                    {paymentInfo.rawPayload?.refNum && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره مرجع:
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {paymentInfo.rawPayload.refNum}
                        </span>
                      </div>
                    )}

                    {paymentInfo.rawPayload?.terminalId && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره ترمینال:
                        </span>
                        <span className="font-semibold">
                          {toPersianNumber(paymentInfo.rawPayload.terminalId)}
                        </span>
                      </div>
                    )}

                    {paymentInfo.rawPayload?.state && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          وضعیت State:
                        </span>
                        <span className="font-semibold">
                          {paymentInfo.rawPayload.state}
                        </span>
                      </div>
                    )}

                    {paymentInfo.rawPayload?.status && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          وضعیت Status:
                        </span>
                        <span className="font-semibold">
                          {toPersianNumber(paymentInfo.rawPayload.status)}
                        </span>
                      </div>
                    )}

                    {paymentInfo.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          تاریخ و زمان تلاش:
                        </span>
                        <span className="font-semibold">
                          {formatDatePersian(
                            paymentInfo.createdAt,
                            "yyyy/MM/dd HH:mm:ss",
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-accent-foreground text-sm">
                        وضعیت:
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        ناموفق
                      </span>
                    </div>

                    {paymentInfo.rawPayload?.verifyError && (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-accent-foreground mb-1 text-sm">
                          خطای تایید:
                        </p>
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          {paymentInfo.rawPayload.verifyError}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <Button asChild>
                <Link href="/booking">تلاش مجدد</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile/appointments">مشاهده نوبت‌های من</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

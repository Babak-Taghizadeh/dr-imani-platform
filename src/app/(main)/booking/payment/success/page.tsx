import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getPaymentLogByAppointmentId } from "@/utils/payment-services";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { formatDatePersian } from "@/lib/persian-number-utils";
import { Separator } from "@/components/ui/separator";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ appointmentId?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const appointmentId = params.appointmentId;

  let paymentInfo = null;
  if (appointmentId) {
    paymentInfo = await getPaymentLogByAppointmentId(appointmentId);
  }

  const transactionDetail = paymentInfo?.rawPayload?.verifyResponse?.TransactionDetail;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="border-green-500">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6" />
            <CardTitle>پرداخت با موفقیت انجام شد</CardTitle>
          </div>
          <CardDescription>نوبت شما با موفقیت ثبت و پرداخت شد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-accent-foreground">
              می‌توانید جزئیات نوبت خود را در پروفایل مشاهده کنید.
            </p>

            {paymentInfo && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">اطلاعات تراکنش</h3>
                  <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-accent-foreground text-sm">
                        مبلغ پرداختی:
                      </span>
                      <span className="font-semibold">
                        {paymentInfo.amount.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>

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

                    {transactionDetail?.RRN && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره RRN:
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {transactionDetail.RRN}
                        </span>
                      </div>
                    )}

                    {transactionDetail?.StraceNo && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره تراکنش:
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {transactionDetail.StraceNo}
                        </span>
                      </div>
                    )}

                    {transactionDetail?.MaskedPan && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره کارت:
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {transactionDetail.MaskedPan}
                        </span>
                      </div>
                    )}

                    {transactionDetail?.TerminalNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          شماره ترمینال:
                        </span>
                        <span className="font-semibold">
                          {toPersianNumber(transactionDetail.TerminalNumber)}
                        </span>
                      </div>
                    )}

                    {paymentInfo.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          تاریخ و زمان تراکنش:
                        </span>
                        <span className="font-semibold">
                          {formatDatePersian(
                            paymentInfo.createdAt,
                            "yyyy/MM/dd HH:mm:ss",
                          )}
                        </span>
                      </div>
                    )}

                    {transactionDetail?.StraceDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-accent-foreground text-sm">
                          تاریخ تراکنش بانک:
                        </span>
                        <span className="font-semibold">
                          {toPersianNumber(transactionDetail.StraceDate)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-accent-foreground text-sm">
                        وضعیت:
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        موفق
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <Button asChild>
                <Link href="/profile/appointments">مشاهده نوبت‌های من</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">بازگشت به صفحه اصلی</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Appointment, AppointmentWithUser } from "@/lib/types";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { toShamsi } from "@/lib/shamsi-utils";
import { statusLabels } from "@/lib/appointment-constants";

interface AppointmentDetailClientProps {
  appointment: Appointment | AppointmentWithUser;
}

export function AppointmentDetailClient({
  appointment,
}: AppointmentDetailClientProps) {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {paymentSuccess && (
        <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">پرداخت با موفقیت انجام شد!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>جزئیات نوبت</CardTitle>
            <Badge
              variant={statusLabels[appointment.status]?.variant || "outline"}
            >
              {statusLabels[appointment.status]?.label || appointment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-accent-foreground text-sm">نوع نوبت</p>
                <p className="font-medium">
                  {appointment.appointmentType === "ONLINE_PHONE"
                    ? "تماس تلفنی"
                    : "حضوری"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-accent-foreground text-sm">تاریخ</p>
                <p className="font-medium">{toShamsi(appointment.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-accent-foreground text-sm">زمان</p>
                <p className="font-medium">
                  {toPersianNumber(appointment.time)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-accent-foreground text-sm">گروه سنی</p>
              <p className="font-medium">
                {appointment.ageRange === "UNDER_15"
                  ? `زیر ${toPersianNumber(15)} سال`
                  : `بالای ${toPersianNumber(15)} سال`}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-accent-foreground text-sm">مبلغ:</span>
              <span className="text-primary text-2xl font-bold">
                {appointment.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </div>

          {appointment.paymentReference && (
            <div className="space-y-1 border-t pt-4">
              <p className="text-accent-foreground text-sm">
                شماره پیگیری پرداخت:
              </p>
              <p className="font-mono text-sm">
                {appointment.paymentReference}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link href="/profile/appointments">بازگشت به لیست نوبت‌ها</Link>
            </Button>
            {appointment.status === "PENDING" && (
              <Button asChild>
                <Link href={`/booking?appointmentId=${appointment.id}`}>
                  پرداخت
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

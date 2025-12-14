import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import { formatDatePersian, toPersianNumber } from "@/lib/persian-number-utils";
import { statusLabels } from "@/lib/appointment-constants";
import type { Appointment } from "@/lib/types";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نوبت‌های من</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                {appointment.appointmentType === "ONLINE_PHONE" ? (
                  <Phone className="text-muted-foreground h-4 w-4" />
                ) : (
                  <Building2 className="text-muted-foreground h-4 w-4" />
                )}
                <span className="text-muted-foreground text-sm">
                  {appointment.appointmentType === "ONLINE_PHONE"
                    ? "تماس تلفنی"
                    : "حضوری"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm sm:text-base">
                  {formatDatePersian(new Date(appointment.date), "yyyy/MM/dd")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm sm:text-base">
                  {toPersianNumber(appointment.time)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">مبلغ:</span>
              <span className="text-sm font-semibold sm:text-base">
                {appointment.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
            <Badge
              variant={statusLabels[appointment.status]?.variant || "outline"}
            >
              {statusLabels[appointment.status]?.label || appointment.status}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/appointments/${appointment.id}`}>
                مشاهده جزئیات
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

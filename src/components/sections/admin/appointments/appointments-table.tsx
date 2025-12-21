"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointmentWithUser } from "@/lib/types";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { toShamsi } from "@/lib/shamsi-utils";

interface AppointmentsTableProps {
  appointments: AppointmentWithUser[];
}

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "در انتظار پرداخت", variant: "outline" },
  CONFIRMED: { label: "تأیید شده", variant: "default" },
};

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>نام</TableHead>
          <TableHead>شماره تلفن</TableHead>
          <TableHead>نوع</TableHead>
          <TableHead>تاریخ</TableHead>
          <TableHead>زمان</TableHead>
          <TableHead>مبلغ</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.userName || "-"}</TableCell>
              <TableCell>
                {appointment.userPhone
                  ? toPersianNumber(appointment.userPhone)
                  : "-"}
              </TableCell>
              <TableCell>
                {appointment.appointmentType === "ONLINE_PHONE"
                  ? "تماس تلفنی"
                  : "حضوری"}
              </TableCell>
              <TableCell>{toShamsi(appointment.date)}</TableCell>
              <TableCell>{toPersianNumber(appointment.time)}</TableCell>
              <TableCell>
                {toPersianNumber(appointment.price.toLocaleString("en-US"))}{" "}
                تومان
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    statusLabels[appointment.status]?.variant || "outline"
                  }
                >
                  {statusLabels[appointment.status]?.label ||
                    appointment.status}
                </Badge>
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-accent-foreground h-24 text-center"
            >
              <div className="flex flex-col items-center gap-1">
                <p className="text-base">نوبتی یافت نشد.</p>
                <p className="text-sm">
                  با فیلترهای فعلی هیچ نوبتی وجود ندارد.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

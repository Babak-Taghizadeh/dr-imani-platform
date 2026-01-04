"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toShamsi } from "@/lib/shamsi-utils";
import { ModifyDisabledDateModal } from "./modify-disabled-date-modal";
import { SureDeleteDisabledDateModal } from "./sure-delete-disabled-date-modal";

interface DisabledDateRange {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

interface DisabledDatesListProps {
  initialDisabledDates: DisabledDateRange[];
}

export function DisabledDatesList({
  initialDisabledDates,
}: DisabledDatesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>تاریخ‌های غیرفعال شده</CardTitle>
        <CardDescription>لیست بازه‌های تاریخی غیرفعال</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>از تاریخ</TableHead>
              <TableHead>تا تاریخ</TableHead>
              <TableHead>توضیحات</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialDisabledDates.length > 0 ? (
              initialDisabledDates.map((range) => (
                <TableRow key={range.id}>
                  <TableCell>{toShamsi(range.startDate)}</TableCell>
                  <TableCell>{toShamsi(range.endDate)}</TableCell>
                  <TableCell>{range.reason || "-"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <ModifyDisabledDateModal disabledDate={range} />
                    <SureDeleteDisabledDateModal disabledDateId={range.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-accent-foreground h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-base">تاریخ غیرفعالی یافت نشد.</p>
                    <p className="text-sm">
                      هنوز هیچ بازه تاریخی غیرفعال نشده است.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

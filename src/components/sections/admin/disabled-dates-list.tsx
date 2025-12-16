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
        {initialDisabledDates.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            هیچ تاریخ غیرفعالی وجود ندارد
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>از تاریخ</TableHead>
                <TableHead>تا تاریخ</TableHead>
                <TableHead>دلیل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialDisabledDates.map((range) => (
                <TableRow key={range.id}>
                  <TableCell>{toShamsi(range.startDate)}</TableCell>
                  <TableCell>{toShamsi(range.endDate)}</TableCell>
                  <TableCell>{range.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

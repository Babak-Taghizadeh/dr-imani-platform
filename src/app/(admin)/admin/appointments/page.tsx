"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import AdminHeader from "@/components/sections/admin/admin-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/sections/admin/table-skeleton";
import { AppointmentsTableEmpty } from "@/components/sections/admin/appointments-table-empty";
import { AdminPagination } from "@/components/sections/admin/admin-pagination";
import type { AdminAppointmentsResponse } from "@/lib/types";
import { formatDatePersian, toPersianNumber } from "@/lib/persian-number-utils";

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

// SWR fetcher function
const fetcher = async (url: string): Promise<AdminAppointmentsResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return res.json();
};

export default function AdminAppointmentsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Build the API URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (fromDate) params.append("from", fromDate);
    if (toDate) params.append("to", toDate);
    if (statusFilter) params.append("status", statusFilter);
    if (appointmentTypeFilter)
      params.append("appointmentType", appointmentTypeFilter);
    params.append("sortOrder", sortOrder);
    params.append("page", page.toString());
    params.append("limit", "20");
    return `/api/admin/appointments?${params}`;
  }, [fromDate, toDate, statusFilter, appointmentTypeFilter, sortOrder, page]);

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR<AdminAppointmentsResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    },
  );

  const appointments = data?.appointments || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="container mx-auto py-8">
      <AdminHeader />
      <Card>
        <CardHeader>
          <CardTitle>مدیریت نوبت‌ها</CardTitle>
          <CardDescription>فیلتر و مدیریت نوبت‌های رزرو شده</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div>
                <Label>از تاریخ</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <Label>تا تاریخ</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <Label>وضعیت</Label>
                <Select
                  value={statusFilter || undefined}
                  onValueChange={(value) => {
                    setStatusFilter(value === "all" ? "" : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="PENDING">در انتظار پرداخت</SelectItem>
                    <SelectItem value="CONFIRMED">تأیید شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>نوع نوبت</Label>
                <Select
                  value={appointmentTypeFilter || undefined}
                  onValueChange={(value) => {
                    setAppointmentTypeFilter(value === "all" ? "" : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="ONLINE_PHONE">تماس تلفنی</SelectItem>
                    <SelectItem value="IN_CLINIC">حضوری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>مرتب‌سازی</Label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => {
                    setSortOrder(value as "asc" | "desc");
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">تاریخ ایجاد (جدیدترین)</SelectItem>
                    <SelectItem value="asc">
                      تاریخ ایجاد (قدیمی‌ترین)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setStatusFilter("");
                    setAppointmentTypeFilter("");
                    setSortOrder("desc");
                    setPage(1);
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-destructive">خطا در بارگذاری داده‌ها</p>
            </div>
          ) : appointments.length === 0 ? (
            <AppointmentsTableEmpty />
          ) : (
            <>
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
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.userName || "-"}</TableCell>
                      <TableCell>{appointment.userPhone || "-"}</TableCell>
                      <TableCell>
                        {appointment.appointmentType === "ONLINE_PHONE"
                          ? "تماس تلفنی"
                          : "حضوری"}
                      </TableCell>
                      <TableCell>
                        {formatDatePersian(
                          new Date(appointment.date),
                          "yyyy/MM/dd",
                        )}
                      </TableCell>
                      <TableCell>{toPersianNumber(appointment.time)}</TableCell>
                      <TableCell>
                        {appointment.price.toLocaleString("fa-IR")} تومان
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusLabels[appointment.status]?.variant ||
                            "outline"
                          }
                        >
                          {statusLabels[appointment.status]?.label ||
                            appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <AdminPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { AppointmentsTable } from "./appointments-table";
import { AppointmentsTableEmpty } from "@/components/sections/admin/appointments-table-empty";
import { AppointmentsTableSkeleton } from "./appointments-table-skeleton";
import { AdminPagination } from "@/components/sections/admin/admin-pagination";
import type {
  AdminAppointmentsResponse,
  AppointmentWithUser,
} from "@/lib/types";
import type { AppointmentsFilterFormData } from "@/lib/validation-schema";

interface AppointmentsDataWrapperProps {
  filters: AppointmentsFilterFormData;
  page: number;
  onPageChange: (page: number) => void;
}

// SWR fetcher function
const fetcher = async (url: string): Promise<AdminAppointmentsResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return res.json();
};

export function AppointmentsDataWrapper({
  filters,
  page,
  onPageChange,
}: AppointmentsDataWrapperProps) {
  // Build the API URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.append("from", filters.fromDate);
    if (filters.toDate) params.append("to", filters.toDate);
    if (filters.status) params.append("status", filters.status);
    if (filters.appointmentType)
      params.append("appointmentType", filters.appointmentType);
    params.append("sortOrder", filters.sortOrder || "desc");
    params.append("page", page.toString());
    params.append("limit", "20");
    return `/api/admin/appointments?${params}`;
  }, [filters, page]);

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

  const appointments: AppointmentWithUser[] = data?.appointments || [];
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading) {
    return <AppointmentsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">خطا در بارگذاری داده‌ها</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return <AppointmentsTableEmpty />;
  }

  return (
    <>
      <AppointmentsTable appointments={appointments} />
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}

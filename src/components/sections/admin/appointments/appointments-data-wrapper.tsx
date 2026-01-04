"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { AppointmentsTable } from "./appointments-table";
import { AppointmentsTableEmpty } from "./appointments-table-empty";
import { AppointmentsTableSkeleton } from "./appointments-table-skeleton";
import PaginationControls from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type {
  AdminAppointmentsResponse,
  AppointmentWithUser,
} from "@/types/types";
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
  const { data, error, isLoading, mutate } = useSWR<AdminAppointmentsResponse>(
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
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            خطا در بارگذاری داده‌ها
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {error instanceof Error ? error.message : "خطای ناشناخته"}
          </p>
          <Button
            onClick={() => mutate()}
            variant="outline"
            className="mt-4"
            size="sm"
          >
            <RefreshCw className="ml-2 h-4 w-4" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return <AppointmentsTableEmpty />;
  }

  return (
    <>
      <AppointmentsTable appointments={appointments} />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        mode="callback"
        onPageChange={onPageChange}
        variant="full"
        usePersianNumbers={true}
      />
    </>
  );
}

"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { AppointmentCard } from "./appointment-card";
import { AppointmentsLoading } from "./appointments-loading";
import { AppointmentsError } from "./appointments-error";
import { AppointmentsEmpty } from "./appointments-empty";
import PaginationControls from "@/components/shared/pagination-controls";
import type { AppointmentsResponse } from "@/types/types";

const fetcher = async (url: string): Promise<AppointmentsResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return res.json();
};

export function AppointmentsListClient() {
  const searchParams = useSearchParams();
  const page = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  }, [searchParams]);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", "10");
    return `/api/appointments?${params}`;
  }, [page]);

  const { data, error, isLoading } = useSWR<AppointmentsResponse>(
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

  if (isLoading) {
    return <AppointmentsLoading />;
  }

  if (error) {
    return <AppointmentsError />;
  }

  if (appointments.length === 0) {
    return <AppointmentsEmpty />;
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        mode="url"
        preserveQueryParams={true}
        variant="simple"
        showPageInfo={true}
        usePersianNumbers={true}
      />
    </>
  );
}

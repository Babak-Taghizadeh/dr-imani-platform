"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { AppointmentCard } from "./appointment-card";
import { AppointmentsLoading } from "./appointments-loading";
import { AppointmentsError } from "./appointments-error";
import { AppointmentsEmpty } from "./appointments-empty";
import { AppointmentsPagination } from "./appointments-pagination";
import type { AppointmentsResponse } from "@/lib/types";
import { getMockAppointments, LIMIT } from "@/lib/mock-appointments";

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

  // Use mock data for testing - set to false to use real API
  const USE_MOCK_DATA = true;

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", LIMIT.toString());
    return `/api/appointments?${params}`;
  }, [page]);

  const { data, error, isLoading } = useSWR<AppointmentsResponse>(
    USE_MOCK_DATA ? null : apiUrl, // Don't fetch if using mock data
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    },
  );

  // Use mock data if enabled, otherwise use API data
  const mockData = USE_MOCK_DATA ? getMockAppointments(page) : null;
  const appointments = mockData?.appointments || data?.appointments || [];
  const totalPages =
    mockData?.pagination?.totalPages || data?.pagination?.totalPages || 1;

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
      <AppointmentsPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { AppointmentCard } from "./appointment-card";
import { AppointmentsLoading } from "./appointments-loading";
import { AppointmentsError } from "./appointments-error";
import { AppointmentsEmpty } from "./appointments-empty";
import { AppointmentsPagination } from "./appointments-pagination";
import type { AppointmentsResponse, Appointment } from "@/lib/types";

// Mock data for testing pagination
const MOCK_APPOINTMENTS: Appointment[] = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const appointmentDate = date.toISOString().split("T")[0];
  const hours = 9 + (i % 8); // Hours from 9 to 16
  const minutes = i % 2 === 0 ? 0 : 30;
  const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return {
    id: `mock-${i + 1}`,
    userId: `user-${i + 1}`,
    appointmentType: i % 2 === 0 ? "ONLINE_PHONE" : "IN_CLINIC",
    ageRange: i % 3 === 0 ? "UNDER_15" : "OVER_15",
    price: 500000 + i * 50000,
    date: appointmentDate,
    time: time,
    durationMinutes: 30,
    status: i % 4 === 0 ? "PENDING" : "CONFIRMED",
    paymentReference: i % 4 === 0 ? null : `PAY-${i + 1}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

const LIMIT = 10;

// Mock data fetcher for testing
const getMockData = (page: number): AppointmentsResponse => {
  const startIndex = (page - 1) * LIMIT;
  const endIndex = startIndex + LIMIT;
  const paginatedAppointments = MOCK_APPOINTMENTS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(MOCK_APPOINTMENTS.length / LIMIT);

  return {
    appointments: paginatedAppointments,
    pagination: {
      page,
      limit: LIMIT,
      total: MOCK_APPOINTMENTS.length,
      totalPages,
    },
  };
};

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
  const mockData = USE_MOCK_DATA ? getMockData(page) : null;
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

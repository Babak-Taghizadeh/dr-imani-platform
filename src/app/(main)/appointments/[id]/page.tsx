import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { AppointmentDetailClient } from "@/components/sections/appointments/appointment-detail-client";
import { AppointmentDetailSkeleton } from "@/components/sections/appointments/appointment-detail-skeleton";
import { getAppointmentById } from "@/utils/appointments-services";
import {
  isMockAppointmentId,
  getMockAppointmentById,
} from "@/lib/mock-appointments";

interface SessionUser {
  id: string;
  role: "user" | "admin";
}

// Use mock data for testing - set to false to use real API
const USE_MOCK_DATA = true;

async function getAppointment(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as SessionUser).role;
  const userId = (session.user as SessionUser).id;

  // Check if this is a mock appointment ID and mock data is enabled
  if (USE_MOCK_DATA && isMockAppointmentId(id)) {
    const mockAppointment = getMockAppointmentById(id);
    if (!mockAppointment) {
      redirect("/profile/appointments");
    }

    // For mock data, we allow access (skip authorization check for testing)
    return mockAppointment;
  }

  const appointment = await getAppointmentById(
    id,
    role === "user" ? userId : undefined,
  );

  if (!appointment) {
    redirect("/profile/appointments");
  }

  // Check authorization: user can only see their own appointments, admin can see all
  if (role === "user" && appointment.userId !== userId) {
    redirect("/profile/appointments");
  }

  return appointment;
}

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    redirect("/profile/appointments");
  }

  return (
    <Suspense fallback={<AppointmentDetailSkeleton />}>
      <AppointmentDetailClient appointment={appointment} />
    </Suspense>
  );
}

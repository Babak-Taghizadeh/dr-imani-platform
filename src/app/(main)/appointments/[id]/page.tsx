import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AppointmentDetailClient } from "@/components/sections/appointments/appointment-detail-client";
import { AppointmentDetailSkeleton } from "@/components/sections/appointments/appointment-detail-skeleton";
import { getAppointmentById } from "@/utils/appointments-services";

interface AppointmentDetailPageParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AppointmentDetailPageParams): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `جزئیات نوبت ${id}`,
    description:
      "مشاهده جزئیات، وضعیت و اطلاعات نوبت رزرو شده در کلینیک خواب دکتر ایمانی",
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "جزئیات نوبت",
      description: "اطلاعات نوبت رزرو شده در کلینیک خواب دکتر ایمانی",
      url: `/appointments/${id}`,
    },
    alternates: {
      canonical: `/appointments/${id}`,
    },
  };
}

interface SessionUser {
  id: string;
  role: "user" | "admin";
}

async function getAppointment(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as SessionUser).role;
  const userId = (session.user as SessionUser).id;

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

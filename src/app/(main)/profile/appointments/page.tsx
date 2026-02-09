import { Suspense } from "react";
import { Metadata } from "next";
import { AppointmentsHeader } from "@/components/sections/appointments/appointments-header";
import { AppointmentsListClient } from "@/components/sections/appointments/appointments-list-client";
import { AppointmentsLoading } from "@/components/sections/appointments/appointments-loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "نوبت‌های من",
  description:
    "مشاهده لیست نوبت‌های رزرو شده، جزئیات و وضعیت هر نوبت در کلینیک خواب دکتر ایمانی",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "نوبت‌های من",
    description: "مشاهده و مدیریت نوبت‌های رزرو شده در کلینیک خواب دکتر ایمانی",
    url: "/profile/appointments",
  },
  alternates: {
    canonical: "/profile/appointments",
  },
};

export default async function UserAppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "user") {
    redirect("/login");
  }
  return (
    <div className="container mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8">
      <AppointmentsHeader />
      <Suspense fallback={<AppointmentsLoading />}>
        <AppointmentsListClient />
      </Suspense>
    </div>
  );
}

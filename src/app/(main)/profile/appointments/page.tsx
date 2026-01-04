import { Suspense } from "react";
import { AppointmentsHeader } from "@/components/sections/appointments/appointments-header";
import { AppointmentsListClient } from "@/components/sections/appointments/appointments-list-client";
import { AppointmentsLoading } from "@/components/sections/appointments/appointments-loading";

export default function UserAppointmentsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8">
      <AppointmentsHeader />
      <Suspense fallback={<AppointmentsLoading />}>
        <AppointmentsListClient />
      </Suspense>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentsManager } from "@/components/sections/admin/appointments/appointments-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت نوبت‌ها",
  description: "فیلتر و مدیریت نوبت‌های رزرو شده",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
    },
  },
  other: {
    referrer: "no-referrer",
    "cache-control": "no-store, max-age=0",
  },
};

export default function AdminAppointmentsPage() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت نوبت‌ها</CardTitle>
          <CardDescription>فیلتر و مدیریت نوبت‌های رزرو شده</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentsManager />
        </CardContent>
      </Card>
    </div>
  );
}

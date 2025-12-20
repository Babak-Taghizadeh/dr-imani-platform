import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/db";
import { disabledDates } from "@/db/schema";
import { redirect } from "next/navigation";
import { DisableDatesForm } from "@/components/sections/admin/disable-dates-form";
import { DisabledDatesList } from "@/components/sections/admin/disabled-dates-list";
import { DisabledDatesTableSkeleton } from "@/components/sections/admin/disabled-dates-table-skeleton";
import { Metadata } from "next";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "مدیریت تاریخ‌های غیرفعال",
  description: "سیستم مدیریت تاریخ‌های غیرفعال برای رزرو نوبت",
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

interface DisabledDateRange {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

async function getDisabledDates(): Promise<DisabledDateRange[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin");
  }

  const disabledRanges = await db
    .select()
    .from(disabledDates)
    .orderBy(disabledDates.startDate);

  // Convert Date objects to strings in yyyy-MM-dd format for serialization
  return disabledRanges.map((range) => ({
    id: range.id,
    startDate:
      typeof range.startDate === "string"
        ? range.startDate
        : format(range.startDate, "yyyy-MM-dd"),
    endDate:
      typeof range.endDate === "string"
        ? range.endDate
        : format(range.endDate, "yyyy-MM-dd"),
    reason: range.reason,
  }));
}

async function DisabledDatesListWrapper() {
  const disabledDatesList = await getDisabledDates();
  return <DisabledDatesList initialDisabledDates={disabledDatesList} />;
}

export default async function DisabledDatesPage() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DisableDatesForm />
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>تاریخ‌های غیرفعال شده</CardTitle>
                <CardDescription>لیست بازه‌های تاریخی غیرفعال</CardDescription>
              </CardHeader>
              <CardContent>
                <DisabledDatesTableSkeleton />
              </CardContent>
            </Card>
          }
        >
          <DisabledDatesListWrapper />
        </Suspense>
      </div>
    </div>
  );
}

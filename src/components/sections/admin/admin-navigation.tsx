"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenSquare, FileText, Calendar, CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/admin/appointments",
    label: "مدیریت نوبت‌ها",
    icon: Calendar,
    iconColor: "text-green-600",
  },
  {
    href: "/admin/disabled-dates",
    label: "تاریخ‌های غیرفعال",
    icon: CalendarX,
    iconColor: "text-orange-600",
  },
  {
    href: "/admin/blogs",
    label: "مدیریت بلاگ‌ها",
    icon: PenSquare,
    iconColor: "text-blue-600",
  },
  {
    href: "/admin/articles",
    label: "مدیریت مقالات",
    icon: FileText,
    iconColor: "text-purple-600",
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-muted/20 flex w-full justify-center gap-2 rounded-lg p-2 shadow-md sm:gap-4 sm:p-4 md:gap-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent p-3 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 md:text-base",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
              isActive
                ? "bg-background text-foreground dark:bg-input/80 dark:border-input dark:text-foreground shadow-sm"
                : "text-muted-foreground dark:text-muted-foreground",
              "hover:bg-background/50",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 sm:h-5 sm:w-5",
                isActive ? tab.iconColor : "text-muted-foreground",
              )}
            />
            <span className="whitespace-nowrap">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

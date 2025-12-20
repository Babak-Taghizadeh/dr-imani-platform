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
    <nav className="bg-muted/20 flex w-full justify-start gap-1.5 overflow-x-auto rounded-lg px-1 py-2 shadow-md [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-4 sm:p-4 md:gap-6 [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex h-[calc(100%-1px)] shrink-0 items-center justify-center gap-1 rounded-md border border-transparent px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs md:p-3 md:text-sm lg:text-base [@media(min-width:500px)]:flex [@media(min-width:500px)]:flex-1",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
              isActive
                ? "bg-background text-foreground dark:bg-input/80 dark:border-input dark:text-foreground shadow-sm"
                : "text-muted-foreground dark:text-muted-foreground",
              "hover:bg-background/50",
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5",
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

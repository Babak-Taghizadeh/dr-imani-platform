"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BookingCard({ children, className }: BookingCardProps) {
  return (
    <Card
      className={cn(
        "shadow-xl border-2 transition-shadow duration-300 hover:shadow-2xl",
        className
      )}
    >
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-2xl font-bold">رزرو نوبت</CardTitle>
        <CardDescription className="text-base">
          مراحل رزرو نوبت را تکمیل کنید
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}


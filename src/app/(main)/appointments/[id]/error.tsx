"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Appointment detail error:", error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            خطا در بارگذاری نوبت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            متأسفانه خطایی در بارگذاری جزئیات نوبت رخ داد. لطفاً دوباره تلاش
            کنید.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>تلاش مجدد</Button>
            <Button variant="outline" asChild>
              <Link href="/profile/appointments">بازگشت به لیست نوبت‌ها</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

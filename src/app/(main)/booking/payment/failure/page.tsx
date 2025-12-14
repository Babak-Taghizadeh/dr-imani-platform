"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="border-red-500">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <XCircle className="h-6 w-6" />
            <CardTitle>پرداخت ناموفق</CardTitle>
          </div>
          <CardDescription>
            متأسفانه پرداخت انجام نشد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <p className="text-sm text-muted-foreground">
                {decodeURIComponent(error)}
              </p>
            )}
            <p className="text-muted-foreground">
              لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/booking">تلاش مجدد</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile/appointments">مشاهده نوبت‌های من</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-green-500">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6" />
            <CardTitle>پرداخت با موفقیت انجام شد</CardTitle>
          </div>
          <CardDescription>نوبت شما با موفقیت ثبت و پرداخت شد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-accent-foreground">
              می‌توانید جزئیات نوبت خود را در پروفایل مشاهده کنید.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/profile/appointments">مشاهده نوبت‌های من</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">بازگشت به صفحه اصلی</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

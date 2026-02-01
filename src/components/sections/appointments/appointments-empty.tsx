import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppointmentsEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نوبت‌های من</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <p className="text-accent-foreground text-xl font-semibold">هنوز نوبتی رزرو نکرده‌اید</p>
        <Button asChild className="mt-4">
          <Link href="/booking">رزرو نوبت</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

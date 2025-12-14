import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentsError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نوبت‌های من</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <p className="text-destructive">خطا در بارگذاری داده‌ها</p>
      </CardContent>
    </Card>
  );
}

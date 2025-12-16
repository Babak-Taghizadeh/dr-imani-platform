import AdminHeader from "@/components/sections/admin/admin-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentsManager } from "@/components/sections/admin/appointments/appointments-manager";

export default function AdminAppointmentsPage() {
  return (
    <div className="container mx-auto py-8">
      <AdminHeader />
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

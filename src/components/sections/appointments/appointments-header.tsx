import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import SectionHeader from "../../shared/section-header";

export function AppointmentsHeader() {
  return (
    <div className="mb-6 flex flex-col">
      <SectionHeader title="لیست نوبت ها" />

      <Button variant="outline" className="ml-auto" asChild>
        <Link href="/profile">
          <ArrowRightCircle className="h-4 w-4" />
          پروفایل
        </Link>
      </Button>
    </div>
  );
}

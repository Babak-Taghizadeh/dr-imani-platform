import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export function AppointmentsHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button variant="outline" asChild>
        <Link href="/profile">
          <ArrowRightCircle className="h-4 w-4" />
          پروفایل
        </Link>
      </Button>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingButton() {
  return (
    <Button
      asChild
      className={cn(
        "gap-2 bg-purple-600 text-white hover:bg-purple-700",
        "shadow-md transition-all hover:shadow-lg",
      )}
    >
      <Link href="/booking">
        <Calendar className="h-4 w-4" />
        <span>رزرو نوبت</span>
      </Link>
    </Button>
  );
}

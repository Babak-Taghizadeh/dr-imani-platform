import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { PhoneCall } from "lucide-react";

export function PhoneButton() {
  return (
    <Link
      href="tel:041-3335-0357"
      className={cn(buttonVariants(), "hover:bg-primary/85")}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="font-bold">۰۴۱-۳۳۳۵۰۳۵۷</span>
      <PhoneCall width={20} height={20} />
    </Link>
  );
}

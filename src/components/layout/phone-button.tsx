import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { PhoneCall } from "lucide-react";

interface PhoneButtonProps {
  showText?: boolean;
}

export function PhoneButton({ showText = true }: PhoneButtonProps) {
  return (
    <Link
      href="tel:041-3335-0357"
      className={cn(
        buttonVariants(),
        "rounded-full [@media(min-width:940px)]:px-4",
      )}
      rel="noopener noreferrer"
      target="_blank"
    >
      <PhoneCall width={20} height={20} />
      {showText && (
        <span className="hidden font-bold [@media(min-width:940px)]:inline-block">
          ۰۴۱-۳۳۳۵۰۳۵۷
        </span>
      )}
    </Link>
  );
}

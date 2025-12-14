import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "../../../public/icons/whatsapp.svg";

interface WhatsAppButtonProps {
  showText?: boolean;
}

export function WhatsAppButton({ showText = true }: WhatsAppButtonProps) {
  return (
    <Link
      href="https://wa.me/989147360827"
      className={cn(
        buttonVariants(),
        "group relative flex items-center gap-1.5 rounded-full bg-[#25D366] p-2 hover:bg-[#25D366]/90",
      )}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Image
        src={WhatsAppIcon}
        alt="WhatsApp Icon"
        width={20}
        height={20}
        priority
        className="brightness-0 invert"
        aria-hidden="true"
      />
      {showText && (
        <span className="hidden font-semibold [@media(min-width:940px)]:inline-block">
          واتساپ
        </span>
      )}
      <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-white/80"></span>
    </Link>
  );
}


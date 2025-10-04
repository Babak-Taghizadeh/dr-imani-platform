import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";
import { buttonVariants } from "../ui/button";
import WhatsAppIcon from "../../../public/icons/whatsapp.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Logo from "../../../public/Logo.png";
import { PhoneCall } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-foreground text-background relative flex h-28 w-full items-center justify-between border-b px-4 md:px-8 lg:px-12 xl:px-28">
      <MobileHeader />
      <Link
        href="/"
        className="font-black sm:block md:hidden lg:text-xl [@media(min-width:1040px)]:block"
      >
        <Image
          src={Logo}
          alt="Clinic Logo"
          priority
          quality={90}
          className="h-auto w-full"
          sizes="(max-width: 768px) 80px, 95px"
        />
      </Link>
      <DesktopHeader />
      <div className="flex flex-col items-center gap-2 md:gap-3 [@media(min-width:930px)]:flex-row">
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
          <span className="hidden font-semibold [@media(min-width:940px)]:inline-block">
            واتساپ
          </span>
          <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-white/80"></span>
        </Link>

        <Link
          href={"tel:041-3335-0357"}
          className={cn(
            buttonVariants(),
            "rounded-full [@media(min-width:940px)]:w-36 [@media(min-width:940px)]:px-4",
          )}
          rel="noopener noreferrer"
          target="_blank"
        >
          <PhoneCall width={20} height={20} />
          <span className="hidden font-bold [@media(min-width:940px)]:inline-block">
            ۰۴۱-۳۳۳۵۰۳۵۷
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

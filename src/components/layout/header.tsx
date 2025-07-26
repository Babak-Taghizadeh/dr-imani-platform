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
    <header className="bg-foreground text-background relative flex h-28 w-full items-center justify-between border-b px-4 md:px-10">
      <MobileHeader />
      <Link
        href="/"
        className="font-black sm:block md:hidden md:text-xl lg:block"
      >
        <Image width={80} src={Logo} alt="logo" />
      </Link>
      <DesktopHeader />
      <div className="flex flex-col items-center gap-1 md:flex-row md:gap-3">
        <Link
          href="https://wa.me/989302871635"
          className={cn(
            buttonVariants(),
            "group relative flex items-center gap-1.5 rounded-full bg-[#25D366] p-2 hover:bg-[#25D366]/90",
          )}
        >
          <Image
            src={WhatsAppIcon}
            alt="WhatsApp"
            width={20}
            height={20}
            className="brightness-0 invert"
          />
          <span className="hidden font-semibold md:inline-block">واتساپ</span>
          <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-white/80"></span>
        </Link>

        <Link
          href={"tel:041-3335-0357"}
          className={cn(buttonVariants(), "rounded-full md:w-36 md:px-4")}
        >
          <PhoneCall width={20} height={20} />
          <span className="hidden font-bold md:inline-block">۰۴۱-۳۳۳۵۰۳۵۷</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

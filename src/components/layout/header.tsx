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
    <header className="bg-foreground text-background flex h-28 w-full items-center justify-between border-b px-4 md:px-10">
      <MobileHeader />
      <DesktopHeader />
      <Link
        href="/"
        className="font-black sm:block md:hidden md:text-xl lg:block"
      >
        <Image width={90} src={Logo} alt="logo" />
      </Link>
      <div className="flex flex-col items-end gap-2 xl:min-w-[400px]">
        <Link
          href={"https://wa.me/989302871635"}
          className={cn(buttonVariants(), "p-2 md:w-36 md:px-4")}
        >
          <Image src={WhatsAppIcon} alt="WhatsApp" width={20} height={20} />
          <span className="hidden font-bold md:inline-block">واتساپ</span>
        </Link>
        <Link
          href={"tel:041-3335-0357"}
          className={cn(buttonVariants(), "p-2 md:w-36 md:px-4")}
        >
          <PhoneCall width={20} height={20} />
          <span className="hidden font-bold md:inline-block">۰۴۱-۳۳۳۵۰۳۵۷</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

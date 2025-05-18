import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";
import { Button } from "../ui/button";
import WhatsAppIcon from "../../../public/icons/whatsapp.svg";
import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-foreground text-background flex h-16 w-full items-center justify-between border-b px-4 md:px-10">
      <MobileHeader />
      <DesktopHeader />
      <Link
        href="/"
        className="font-black sm:block md:hidden md:text-xl lg:block"
      >
        کلینیک خواب دکتر ایمانی
      </Link>
      <div className="flex justify-end xl:min-w-[400px]">
      <Button className="p-2 md:px-4">
          <Image src={WhatsAppIcon} alt="WhatsApp" width={20} height={20} />
          <span className="hidden md:inline-block">تماس از واتساپ</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;

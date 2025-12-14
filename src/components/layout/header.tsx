import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import { UserMenu } from "./user-menu";
import { WhatsAppButton } from "./whatsapp-button";
import { PhoneButton } from "./phone-button";

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
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex flex-col items-center gap-2 md:gap-3 [@media(min-width:930px)]:flex-row">
          <WhatsAppButton showText={false} />
          <PhoneButton showText={false} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

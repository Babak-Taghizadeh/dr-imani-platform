import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import { UserMenu } from "./user-menu";

const Header = () => {
  return (
    <header className="bg-foreground text-background relative flex h-24 w-full items-center justify-between border-b px-3 md:h-28 md:px-8 lg:px-12 xl:px-28">
      <div className="block md:hidden">
        <UserMenu />
      </div>
      <Link
        href="/"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
      >
        <Image
          src={Logo}
          alt="Clinic Logo"
          priority
          quality={90}
          className="h-auto w-full"
          sizes="(max-width: 768px) 75px, 90px"
        />
      </Link>
      <MobileHeader />
      <DesktopHeader />
      <div className="hidden md:block">
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;

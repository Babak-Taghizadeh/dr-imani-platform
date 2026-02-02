import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";
import Logo from "../../../public/Logo.png";
import Image from "next/image";
import { UserMenu } from "./user-menu";

const Header = () => {
  return (
    <header className="bg-foreground text-background relative flex h-24 w-full items-center justify-between border-b px-4 md:h-28 md:px-8 lg:px-12 xl:px-28">
      <Link href="/" className="font-black">
        <Image
          src={Logo}
          alt="Clinic Logo"
          priority
          quality={90}
          className="h-auto w-full"
          sizes="(max-width: 768px) 70px, 90px"
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

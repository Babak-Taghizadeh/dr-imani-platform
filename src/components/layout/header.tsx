import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";

const Header = () => {
  return (
    <header className="bg-foreground text-background flex h-16 w-full items-center border-b justify-between px-4 md:px-10">
      <MobileHeader />
      <DesktopHeader />
      <Link href="/" className="text-xl font-bold">
        دکتر ایمانی
      </Link>
    </header>
  );
};

export default Header;

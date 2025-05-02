import Link from "next/link";
import MobileHeader from "./header/mobile-header";
import DesktopHeader from "./header/desktop-header";

const Header = () => {
  return (
    <header className="bg-foreground text-background flex h-16 w-full items-center justify-between border-b px-4 shadow-sm md:px-10">
      <MobileHeader />
      <DesktopHeader />
      <Link href="/" className="text-xl font-bold">
        دکتر ایمانی
      </Link>
    </header>
  );
};

export default Header;

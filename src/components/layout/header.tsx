import Link from "next/link";
import DesktopHeader from "./header/desktop-header";
import MobileHeader from "./header/mobile-header";

const Header = () => {
  return (
    <header className="bg-foreground text-background flex h-16 w-full items-center justify-between border-b px-4 md:px-10">
      <MobileHeader />
      <DesktopHeader />
      <Link href="/" className="text-xl font-bold">
        کلینیک خواب دکتر ایمانی
      </Link>
    </header>
  );
};

export default Header;

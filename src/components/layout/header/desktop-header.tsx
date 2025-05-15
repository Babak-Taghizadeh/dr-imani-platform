import { NAV_ITEMS } from "@/lib/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";
import Link from "next/link";

const DesktopHeader = () => {
  return (
    <NavigationMenu
      dir="rtl"
      className="hidden md:flex xl:min-w-[400px] xl:justify-start"
    >
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              className="hover:text-primary hover:bg-primary-foreground text-lg font-semibold"
              asChild
            >
              <Link href={item.path} className="px-4">
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopHeader;

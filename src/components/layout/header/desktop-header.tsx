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
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink className="text-lg hover:bg-inherit hover:text-orange-400" asChild>
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

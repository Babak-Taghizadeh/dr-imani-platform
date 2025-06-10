"use client";

import { NAV_ITEMS } from "@/lib/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DesktopHeader = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu
      dir="rtl"
      className="hidden md:flex xl:min-w-[400px] xl:justify-start"
    >
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              className={cn(
                "rounded-sm text-lg font-semibold",
                pathname === item.path && "border-background/60 border-b",
              )}
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

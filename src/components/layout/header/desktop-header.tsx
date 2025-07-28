"use client";

import { NAV_ITEMS } from "@/lib/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DesktopHeader = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu
      dir="rtl"
      className="hidden md:flex xl:min-w-[400px] xl:justify-start xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 xl:transform"
    >
      <NavigationMenuList className="flex gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.path}
                  className={cn(
                    "text-muted-foreground relative px-4 py-2 font-semibold transition-colors duration-200",
                    "after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-purple-500 after:transition-all after:duration-300",
                    "hover:after:w-1/2",
                    isActive &&
                      "scale-110 text-purple-400 after:w-1/2 after:bg-purple-500",
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopHeader;

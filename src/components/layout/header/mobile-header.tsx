import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import Link from "next/link";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants";

const MobileHeader = () => {
  return (
    <Drawer>
      <DrawerTrigger className="md:hidden" asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-foreground text-background md:hidden">
        <DrawerHeader>
          <DrawerTitle className="text-lgtext-background text-center font-semibold">
            منو
          </DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-4 px-4">
          {NAV_ITEMS.map((item) => (
            <DrawerClose asChild key={item.title}>
              <Link key={item.title} href={item.path}>
                {item.title}
              </Link>
            </DrawerClose>
          ))}
        </nav>
        <DrawerFooter className="items-center">
          <Button className="w-1/2" variant="outline">
            Login
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-1/2">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeader;

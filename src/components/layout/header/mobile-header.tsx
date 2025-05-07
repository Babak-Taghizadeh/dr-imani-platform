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

import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const MobileHeader = () => {
  return (
    <Drawer>
      <DrawerTrigger className="md:hidden" asChild>
        <Button variant="ghost" size="icon">
          <DotsHorizontalIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-foreground text-background md:hidden">
        <DrawerHeader>
          <DrawerTitle className="text-lgtext-background text-center font-semibold">
            صفحات
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
          <DrawerClose asChild>
            <Button variant="outline" className="w-1/3">
              بستن
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeader;

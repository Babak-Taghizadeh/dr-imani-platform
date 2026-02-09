"use client";

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
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { BookingButton } from "../booking-button";

const MobileHeader = () => {
  const pathname = usePathname();
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // const handleSignOut = async () => {
  //   try {
  //     await signOut({ redirect: false });
  //     toast.success("با موفقیت خارج شدید");
  //     router.push("/");
  //   } catch {
  //     toast.error("خطایی در خروج رخ داد");
  //   }
  // };

  // const isAuthenticated = status === "authenticated" && session;
  // const userRole = session?.user?.role ?? null;
  // const userName = session?.user?.name || "کاربر";

  return (
    <Drawer>
      <DrawerTrigger className="md:hidden" asChild>
        <Button variant="ghost" size="icon">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-foreground text-background md:hidden">
        <DrawerHeader>
          <DrawerTitle className="text-background text-center text-xl font-bold">
            صفحات
          </DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-4 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <DrawerClose asChild key={item.title}>
                <Link
                  key={item.title}
                  href={item.path}
                  className={cn(
                    "group relative py-1 transition-colors duration-200",
                    "text-background/80 hover:text-purple-400",
                    isActive && "text-purple-400",
                  )}
                >
                  <span
                    className={cn(
                      "relative inline-block",
                      item.special && !isActive && "animate-pulse font-black",
                    )}
                  >
                    {item.title}
                    {item.special && !isActive && (
                      <div className="absolute top-0 right-20 flex h-1 w-1 gap-0.5 rounded-full bg-purple-500"></div>
                    )}
                    {/* The underline element is now here to fit the span's width */}
                    <span
                      className={cn(
                        "absolute right-0 -bottom-1 h-[2px] w-0 bg-purple-400 transition-all duration-300",
                        isActive && "w-full",
                      )}
                    />
                  </span>
                </Link>
              </DrawerClose>
            );
          })}

          <Separator className="bg-background/20" />

          {/* Booking Button */}
          <DrawerClose asChild>
            <BookingButton />
          </DrawerClose>

          <Separator className="bg-background/20" />

          {/* User Menu Items */}
          {/* {isAuthenticated && userRole === "user" ? (
            <>
              <div className="text-background/60 flex items-center gap-2 px-2 py-1 text-sm">
                <UserCircle className="h-4 w-4" />
                <span className="truncate">{userName}</span>
              </div>
              <DrawerClose asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-2 py-2 transition-colors",
                    "text-background/80 hover:text-purple-400",
                    pathname === "/profile" && "text-purple-400",
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>پروفایل</span>
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href="/profile/appointments"
                  className={cn(
                    "flex items-center gap-2 py-2 transition-colors",
                    "text-background/80 hover:text-purple-400",
                    pathname === "/profile/appointments" && "text-purple-400",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span>نوبت‌های من</span>
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <button
                  onClick={handleSignOut}
                  className={cn(
                    "flex w-full items-center gap-2 py-2 text-right transition-colors",
                    "text-background/80 hover:text-destructive",
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span>خروج</span>
                </button>
              </DrawerClose>
            </>
          ) : (
            <DrawerClose asChild>
              <Link
                href="/login"
                className={cn(
                  "flex items-center gap-2 py-2 transition-colors",
                  "text-background/80 hover:text-purple-400",
                  pathname === "/login" && "text-purple-400",
                )}
              >
                <User className="h-4 w-4" />
                <span>ورود</span>
              </Link>
            </DrawerClose>
          )} */}
        </nav>
        <DrawerFooter className="items-center">
          <DrawerClose asChild>
            <Button className="w-1/3">بستن</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeader;

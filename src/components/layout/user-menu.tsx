"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Calendar, UserCircle } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("با موفقیت خارج شدید");
      router.push("/");
    } catch {
      toast.error("خطایی در خروج رخ داد");
    }
  };

  // Show login button when not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <Button
        asChild
        variant="outline"
        className="hidden gap-2 [@media(min-width:930px)]:flex"
      >
        <Link href="/login">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">ورود</span>
        </Link>
      </Button>
    );
  }

  // Show user menu when authenticated
  const userName = session.user?.name || "کاربر";
  const userRole = session.user?.role;

  // Only show menu for regular users (not admin)
  if (userRole === "admin") {
    return null; // Admin has separate navigation
  }

  return (
    <div className="hidden [@media(min-width:930px)]:block">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" aria-label="منوی کاربر">
            <UserCircle className="h-4 w-4" />
            <span className="hidden max-w-[120px] truncate sm:inline">
              {userName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs leading-none">
                حساب کاربری
              </p>
              <p className="text-sm leading-none font-medium">{userName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex cursor-pointer items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>پروفایل</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/profile/appointments"
              className="flex cursor-pointer items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>نوبت‌های من</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>خروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

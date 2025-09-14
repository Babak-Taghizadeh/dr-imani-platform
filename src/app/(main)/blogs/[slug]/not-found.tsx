import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

const NotFound = () => {
  return (
    <main
      dir="rtl"
      className="bg-background grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8"
    >
      <div className="text-center">
        <p className="text-primary text-2xl font-semibold">۴۰۴</p>
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری
          منتقل شده است.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild className="group hover:bg-purple-600">
            <Link href="/">
              بازگشت به خانه
              <Home className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="group">
            <Link href="/blogs">
              مشاهده مقالات
              <ArrowRight className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

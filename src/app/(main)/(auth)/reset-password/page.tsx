import { ResetPasswordForm } from "@/components/sections/auth/reset-password-form";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "بازنشانی رمز عبور",
  description:
    "تنظیم رمز عبور جدید برای حساب کاربری کلینیک خواب دکتر ایمانی",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "بازنشانی رمز عبور",
    description: "تنظیم رمز عبور جدید",
    url: "/reset-password",
  },
  alternates: {
    canonical: "/reset-password",
  },
};

interface ResetPasswordPageProps {
  searchParams?: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params?.token;

  if (!token) {
    return (
      <AuthLayout
        title="خطا"
        description="توکن معتبر نیست. لطفاً دوباره تلاش کنید."
      >
        <Button asChild className="h-11 w-full font-medium">
          <Link href="/forgot-password">بازیابی رمز عبور</Link>
        </Button>
      </AuthLayout>
    );
  }

  return <ResetPasswordForm token={token} />;
}

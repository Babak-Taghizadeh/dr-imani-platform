import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/sections/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "بازیابی رمز عبور",
  description:
    "بازیابی رمز عبور حساب کاربری در کلینیک خواب دکتر ایمانی",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "بازیابی رمز عبور",
    description: "دریافت لینک بازیابی رمز عبور",
    url: "/forgot-password",
  },
  alternates: {
    canonical: "/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

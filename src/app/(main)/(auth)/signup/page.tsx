import { Metadata } from "next";
import { SignupForm } from "@/components/sections/auth/signup-form";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description:
    "ثبت‌نام در کلینیک خواب دکتر ایمانی برای رزرو نوبت و دسترسی به خدمات",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "ثبت‌نام",
    description: "ایجاد حساب کاربری در کلینیک خواب دکتر ایمانی",
    url: "/signup",
  },
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return <SignupForm />;
}

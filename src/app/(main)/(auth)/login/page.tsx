import { Metadata } from "next";
import { LoginForm } from "@/components/sections/auth/login-form";

export const metadata: Metadata = {
  title: "ورود",
  description:
    "ورود به حساب کاربری کلینیک خواب دکتر ایمانی برای دسترسی به نوبت‌ها و پروفایل",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "ورود",
    description: "ورود به حساب کاربری کلینیک خواب دکتر ایمانی",
    url: "/login",
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}

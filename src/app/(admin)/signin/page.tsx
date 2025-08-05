import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/sections/admin/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود ادمین",
  description: "سیستم احراز هویت مدیریت محتوای کلینیک تخصصی خواب",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
    },
  },
  other: {
    referrer: "no-referrer",
    "cache-control": "no-store, max-age=0",
  },
};

const SignInPage = () => {
  return (
    <main className="bg-muted flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">ورود ادمین</CardTitle>
        </CardHeader>
        <LoginForm />
      </Card>
    </main>
  );
};

export default SignInPage;

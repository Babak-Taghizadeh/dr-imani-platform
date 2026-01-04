import type { Metadata } from "next";
import "../(main)/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت کلینیک خواب",
    template: "%s | پنل مدیریت",
  },
  description: "سیستم مدیریت محتوای کلینیک تخصصی خواب دکتر ایمانی",
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
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://drimanisleepclinic.com",
  },
  other: {
    referrer: "no-referrer",
    "cache-control": "no-store, max-age=0",
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster expand={true} position="top-center" richColors />
    </>
  );
}

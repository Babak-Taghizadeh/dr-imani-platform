import type { Metadata } from "next";
import localFont from "next/font/local";
import "../(main)/globals.css";
import { Toaster } from "sonner";

const IRANSansXV = localFont({
  src: "../../../public/fonts/IRANSansXV.woff2",
});

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

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${IRANSansXV.className} antialiased`}>
        {children}
        <Toaster expand={true} position="top-center" richColors />
      </body>
    </html>
  );
}

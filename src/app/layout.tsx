import type { Metadata } from "next";
import localFont from "next/font/local";
import "./(main)/globals.css";

const IRANSansXV = localFont({
  src: "../../public/fonts/IRANSansXV.woff2",
});

export const metadata: Metadata = {
  title: {
    default:
      "کلینیک خواب دکتر ایمانی تبریز | تخصصی ترین مرکز درمان اختلالات خواب",
    template: "%s | کلینیک خواب دکتر ایمانی تبریز",
  },
  description:
    "بهترین کلینیک خواب در تبریز | تشخیص و درمان اختلالات خواب با استانداردهای جهانی | تحت نظارت پزشک متخصص",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${IRANSansXV.className} antialiased`}>{children}</body>
    </html>
  );
}

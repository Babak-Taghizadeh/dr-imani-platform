import type { Metadata } from "next";
import localFont from "next/font/local";
import "../(main)/globals.css";

const IRANSansXV = localFont({
  src: "../../../public/fonts/IRANSansXV.woff2",
});

export const metadata: Metadata = {
  title: "Admin - Blogs",
  description: "Portfolio",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${IRANSansXV.className} antialiased`}>{children}</body>
    </html>
  );
}

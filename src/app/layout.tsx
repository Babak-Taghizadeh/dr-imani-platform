import type { Metadata } from "next";
import localFont from "next/font/local";
import "./(main)/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import TopLoader from "nextjs-toploader";

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
  other: {
    enamad: "34030070",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${IRANSansXV.className} antialiased`}>
        <TopLoader
          color="#6832a9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

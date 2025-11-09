import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://drimanisleepclinic.com"),
  title: {
    default:
      "کلینیک خواب دکتر ایمانی تبریز | تخصصی ترین مرکز درمان اختلالات خواب",
    template: "%s | کلینیک خواب دکتر ایمانی تبریز",
  },
  description:
    "بهترین کلینیک خواب در تبریز | تشخیص و درمان اختلالات خواب با استانداردهای جهانی | تحت نظارت پزشک متخصص",
  keywords: [
    "کلینیک خواب تبریز",
    "دکتر ایمانی تبریز",
    "درمان بی خوابی تبریز",
    "آپنه خواب در تبریز",
    "درمان خرو پف در تبریز",
    "دکتر ویدا ایمانی تبریز",
    "بهترین متخصص خواب تبریز",
    "درمان خروپف تبریز",
    "درمان اختلالات خواب تبریز",
    "مرکز اختلالات خواب آذربایجان شرقی",
    "پلی سومنوگرافی در تبریز",
    "مشکل کم خوابی تبریز",
    "مرکز تخصصی خواب شمالغرب",
    "خواب خوب در تبریز",
    "بهداشت خواب تبریز",
    "کلینیک خواب استان آذربایجان شرقی",
  ],
  authors: [{ name: "دکتر ایمانی", url: "https://drimanisleepclinic.com" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://drimanisleepclinic.com",
    title: "کلینیک تخصصی خواب دکتر ایمانی | تبریز",
    description:
      "تخصصی ترین مرکز درمان اختلالات خواب در شمالغرب کشور با کادری مجرب و تجهیزات پیشرفته",
    siteName: "کلینیک خواب دکتر ایمانی",
    images: [
      {
        url: "/open-graph/home-fa.png",
        width: 1200,
        height: 630,
        alt: "کلینیک خواب دکتر ایمانی در تبریز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "کلینیک خواب دکتر ایمانی - تخصصی ترین مرکز خواب تبریز",
    description:
      "درمان تخصصی اختلالات خواب شامل آپنه، بی خوابی و خروپف با جدیدترین روش ها در تبریز",
    images: ["/open-graph/home-fa.png"],
  },
  alternates: {
    canonical: "https://drimanisleepclinic.com",
    languages: {
      "fa-IR": "https://drimanisleepclinic.com/fa",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.placename": "تبریز",
    "geo.position": "38.096235;46.273418",
    "geo.region": "IR-01",
    ICBM: "38.096235, 46.273418",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;

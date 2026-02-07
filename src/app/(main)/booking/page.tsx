import { BookingForm } from "@/components/sections/booking/booking-form";
import { BookingHero } from "@/components/sections/booking/booking-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "رزرو نوبت",
  description:
    "رزرو آنلاین نوبت کلینیک خواب دکتر ایمانی در تبریز. انتخاب تاریخ و زمان مناسب برای مشاوره و درمان اختلالات خواب",
  keywords: [
    "رزرو نوبت کلینیک خواب تبریز",
    "نوبت دهی آنلاین دکتر ایمانی",
    "رزرو نوبت خواب",
    "نوبت مشاوره خواب تبریز",
    "رزرو آنلاین کلینیک خواب",
    "نوبت ویزیت متخصص خواب",
  ],
  openGraph: {
    title: "رزرو نوبت",
    description:
      "رزرو آنلاین نوبت کلینیک تخصصی خواب دکتر ایمانی در تبریز",
    url: "/booking",
    images: [
      {
        url: "/open-graph/home-fa.png",
        width: 1200,
        height: 630,
        alt: "رزرو نوبت کلینیک خواب دکتر ایمانی",
      },
    ],
  },
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <BookingHero />
      <BookingForm />
    </div>
  );
}

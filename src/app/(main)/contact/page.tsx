import ContactDetails from "@/components/sections/contact-us/contact-details";
import MapWrapper from "@/components/sections/contact-us/map-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباطی، آدرس دقیق و ساعت کاری کلینیک خواب دکتر ایمانی در تبریز. دریافت نوبت مشاوره و پاسخ به سوالات شما",
  keywords: [
    "نوبت دهی کلینیک خواب تبریز",
    "شماره تماس دکتر ایمانی",
    "آدرس کلینیک خواب تبریز",
    "ساعات کاری متخصص خواب",
    "مشاوره تلفنی اختلالات خواب",
    "مسیر دسترسی کلینیک دکتر ایمانی",
    "شماره اضطراری خواب تبریز",
    "تماس با بهترین متخصص خواب آذربایجان شرقی",
    "تماس با دکتر ایمانی",
    "تماس با دکتر ایمانی تبریز",
    "واتساپ دکتر ایمانی",
    "واتساپ کلینیک دکتر ایمانی",
  ],
  openGraph: {
    title: "تماس با ما",
    description:
      "اطلاعات تماس و مسیر دسترسی به کلینیک تخصصی خواب دکتر ایمانی در تبریز",
    url: "/contact",
    images: [
      {
        url: "/open-graph/contact-fa.png",
        width: 1200,
        height: 630,
        alt: "موقعیت و اطلاعات تماس کلینیک خواب دکتر ایمانی در خیابان آزادی تبریز",
      },
    ],
  },
  alternates: {
    canonical: "/contact",
  },
  other: {
    "contact:phone": "+984133350357",
    "contact:phone_local": "041-33350357",
    "contact:whatsapp": "+989302871635",
  },
};

const Contact = () => {
  return (
    <section className="bg-foreground text-background flex min-h-[700px] flex-col gap-12 px-8 py-12 md:justify-center md:gap-16 lg:flex-row">
      <ContactDetails />
      <div className="relative z-50 h-[40dvh] w-full self-center md:w-[60%] lg:min-h-[50dvh]">
        <MapWrapper />
      </div>
    </section>
  );
};

export default Contact;

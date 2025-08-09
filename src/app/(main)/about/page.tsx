import PicList from "@/components/shared/pic-list";
import Avatar from "../../../../public/dr-imani.jpg";
import AboutCycle from "@/components/sections/about/about-cycle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "تخصص و تجربه‌ی کلینیک خواب دکتر ایمانی در تبریز: شناخت تیم متخصص، تجهیزات پیشرفته و روش‌های نوین درمان اختلالات خواب",
  keywords: [
    "درباره دکتر ایمانی",
    "تخصص خواب تبریز",
    "تیم کلینیک خواب",
    "سوابق درمان اختلالات خواب",
    "تجربه دکتر ایمانی",
    "تجهیزات کلینیک خواب",
    "اعتبارنامه‌های پزشکی خواب",
    "تاریخچه کلینیک خواب تبریز",
    "افتخارات متخصص خواب",
  ],
  openGraph: {
    title: "درباره ما | کلینیک تخصصی خواب دکتر ایمانی",
    description:
      "معرفی تیم متخصص و تجهیزات پیشرفته‌ی کلینیک خواب دکتر ایمانی در تبریز",
    url: "/about",
    images: [
      {
        url: "/open-graph/about-fa.jpg",
        width: 800,
        height: 600,
        alt: "تیم تخصصی کلینیک خواب دکتر ایمانی در تبریز",
      },
    ],
  },
  alternates: {
    canonical: "/about",
  },
  other: {
    "content-language": "fa-IR",
    author: "کلینیک خواب دکتر ایمانی",
  },
};

const AboutMe = () => {
  return (
    <PicList
      InfoElement={<AboutCycle />}
      pic={Avatar}
      theme="dark"
      alt="عکس دکتر ویدا ایمانی"
      orientation="portrait"
    />
  );
};

export default AboutMe;

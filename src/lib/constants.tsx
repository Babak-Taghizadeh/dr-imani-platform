import {
  InstagramLogoIcon,
  Link2Icon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import { MapPin, PhoneIcon } from "lucide-react";

export const NAV_ITEMS: { title: string; path: string }[] = [
  {
    title: "خانه",
    path: "/",
  },
  {
    title: "درباره من",
    path: "/about",
  },
  {
    title: "تماس با ما",
    path: "/contact",
  },
  {
    title: "مقالات",
    path: "/articles",
  },
  {
    title: "وبلاگ",
    path: "/blogs",
  },
];

export const FOOTER_ITEMS: Record<
  string,
  { title: string; path?: string; icon?: React.ReactNode; value?: string }[]
> = {
  brand: [
    {
      title: "متخصص خواب - سلامت خواب",
    },
    {
      title: "کمک به بهبود کیفیت خواب و یک زندگی سالم تر",
    },
  ],
  nav: [
    {
      title: "صفحات",
    },
    {
      title: "خانه",
      path: "/",
    },
    {
      title: "درباره من",
      path: "/about",
    },
    {
      title: "تماس با ما",
      path: "/contact",
    },
    {
      title: "وبلاگ",
      path: "/blogs",
    },
  ],
  contact: [
    {
      title: "پل های ارتباطی",
    },
    {
      title: "اینستاگرام",
      icon: <InstagramLogoIcon width={20} height={20} />,
      value: "https://www.instagram.com/dr.imani.sleepclinic",
    },
    {
      title: "۰۴۱-۳۳۳۵۰۳۵۷",
      icon: <Link2Icon width={20} height={20} />,
      value: "tel:041-3335-0357",
    },
    {
      title: "تبریز، خیابان آزادی، سه راه گلگشت، ساختمان گلگشت، طبقه چهارم",
      icon: <SewingPinIcon width={20} height={20} />,
    },
  ],
};

export const SERVICES_ITEMS: { title: string; desc: string }[] = [
  {
    title: "درمان ریشه ای بی خوابی",
    desc: " با متد های بروز و تایید شده در مقیاس جهانی",
  },
  {
    title: "درمان آپنه",
    desc: "یکی از بزرگترین عوامل تهدید کننده ی سلامتی",
  },
  {
    title: "مانیتورینک و تحلیل",
    desc: "توسط بروزتزین و دقیق ترین ابزار موجود در بازار",
  },
];

export const FAQ_ITEMS: { title: string; desc?: string }[] = [
  {
    title: "سوالات متداول",
  },
  {
    title: "ساعات و روز های کاری مطب چه موقعی است؟",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "مدت زمان پروسه درمان آپنه چقدر است؟",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    title: "آیا بیماری های مربوط به خواب منجر به بیماری های جدی تر می شود؟",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
];

export const ABOUT_ME_ITEMS = {
  experience: [
    {
      position: "فوق تخصص خواب",
      hospital: "کلینیک خواب دکتر ایمانی",
      years: "۲۰۱۷ - تا کنون",
    },
    {
      position: "فوق تخصص خواب",
      hospital: "ویزیت آنلاین",
      years: "۲۰۲۲ - تا کنون",
    },
    {
      position: "متخصص خواب",
      hospital: "بیمارستان آجی بادم و 9 ایلول",
      years: "۲۰۱۹ - ۲۰۲۲",
    },
    {
      position: "متخصص کودکان",
      hospital: "بیمارستان علوی",
      years: "۲۰۱۳ - ۲۰۱۸",
    },
    {
      position: "متخصص کودکان",
      hospital: "بیمارستان علوی",
      years: "۲۰۱۳ - ۲۰۱۸",
    },
  ],
  education: [
    {
      degree: "فلوشیپ اختلالات خواب",
      institution: "دانشگاه آجی بادم ترکیه",
      years: "۲۰۱۹ - ۲۰۲۰",
      description: "Specialized in interventional cardiology techniques",
      details: "Specialized in interventional cardiology techniques",
    },
    {
      degree: "فلوشیپ پزشکی خواب",
      institution: "دانشگاه بابایی قزوین",
      years: "۲۰۱۷ - ۲۰۱۸",
      description: "Specialized in interventional cardiology techniques",
      details: "Specialized in interventional cardiology techniques",
    },
    {
      degree: "متخصص کودکان",
      institution: "دانشگاه علوم پزشکی تبریز",
      years: "2011 - 2014",
      description: "Specialized in interventional cardiology techniques",
      details: "Specialized in interventional cardiology techniques",
    },
    {
      degree: "پزشک عمومی",
      institution: "دانشگاه علوم پزشکی تبریز",
      years: "2001 - 2008",
      description: "Specialized in interventional cardiology techniques",
      details: "Specialized in interventional cardiology techniques",
    },
  ],
  honors: [
    {
      title: "یک درصد پژوهشگر و دانشمندان برتر",
      year: "۲۰۲۴",
    },
    {
      title: "بانوی موفق و کارافرین ایران در سال",
      year: "۱۴۰۳",
    },
    {
      title: "جزو پژوهشگران افتخاری",
      year: "۲۲۲۲",
      description: " دانشگاه استنفورد",
    },
    {
      title: "نویسنده فصل خواب کتاب",
      year: "۲۲۲۲",
      description: "انتشارات Springer",
    },
    {
      title: "جوانترین سخنران و پزشک شاخص و نویسنده برترین مقاله",
      year: "۱۳۹۷",
      description: "در بین متخصصین کودکان",
    },
    {
      title: "پزشک پیشرو و نویسنده برترین مقاله پژوهشی",
      year: "۱۳۹۷",
      description: "چهلمین سالگرد دکتر محمد قریب",
    },
    {
      title: "عضو‌کمیته علمی سمینار و سخنرانی",
      year: "۱۳۹۷",
      description: "استانبول - پکن - دهلی",
    },
    {
      title: "برگزارکننده و دبیر سمینار",
      year: "۱۴۰۴",
      description: "تازه های بیماریهای قلبی و اختلالات خواب",
    },
  ],
};

export const CONTACT_ITEMS: {
  title: string;
  desc?: string;
  value?: string;
  icon?: React.ReactNode;
}[] = [
  {
    title: "تماس با کلینیک",
  },
  {
    title: "اینستاگرام",
    desc: "dr.imani.sleepclinic@",
    value: "dr.imani.sleepclinic",
    icon: <InstagramLogoIcon height={24} width={24} />,
  },
  {
    title: "شماره تماس",
    desc: "۰۴۱-۳۳۳۵۰۳۵۷",
    value: "041-3335-0357",
    icon: <PhoneIcon />,
  },
  {
    title: "آدرس",
    desc: "تبریز، خیابان آزادی، سه راه گلگشت، ساختمان گلگشت، طبقه چهارم",
    icon: <MapPin />,
  },
];

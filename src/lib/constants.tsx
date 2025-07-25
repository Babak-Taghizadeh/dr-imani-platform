import EducationList from "@/components/sections/about/education-list";
import ExperienceList from "@/components/sections/about/experience-list";
import HonorsList from "@/components/sections/about/honors-list";

import {
  InstagramLogoIcon,
  Link2Icon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import {
  Activity,
  Bed,
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
  MonitorSmartphone,
  PhoneIcon,
  Trophy,
} from "lucide-react";
import { TabConfig } from "./types";

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
    title: "وبلاگ",
    path: "/blogs",
  },
  {
    title: "مقالات",
    path: "/articles",
  },
];

export const FOOTER_ITEMS: Record<
  string,
  { title: string; path?: string; icon?: React.ReactNode; value?: string }[]
> = {
  brand: [
    {
      title: "دکتر ویدا ایمانی",
    },
    {
      title: "فلوشیپ فوق تخصصی اختلالات خواب کودکان و بزرگسالان",
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

export const SERVICES_ITEMS: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
  details?: string[];
  cta?: { label: string; url: string };
}[] = [
  {
    title: "درمان ریشه‌ای بی‌خوابی",
    desc: "با متدهای بروز و تاییدشده در مقیاس جهانی",
    icon: <Bed className="h-8 w-8 text-blue-500" />,
    details: [
      "بررسی دقیق الگوهای خواب",
      "استفاده از روان‌درمانی رفتاری (CBT-I)",
      "درمان بدون وابستگی به دارو",
    ],
    cta: { label: "مشاوره رایگان", url: "/contact" },
  },
  {
    title: "درمان آپنه خواب",
    desc: "یکی از بزرگ‌ترین عوامل تهدیدکننده‌ی سلامتی",
    icon: <Activity className="h-8 w-8 text-red-500" />,
    details: [
      "تشخیص دقیق با کمک دستگاه‌های مانیتورینگ خواب",
      "استفاده از ماسک‌های CPAP و متدهای جایگزین",
      "کاهش فشار خون و خستگی مزمن",
    ],
    cta: { label: "اطلاعات بیشتر", url: "/services/apnea" },
  },
  {
    title: "مانیتورینگ و تحلیل خواب",
    desc: "توسط بروزترین و دقیق‌ترین ابزار موجود در بازار",
    icon: <Monitor className="h-8 w-8 text-green-500" />,
    details: [
      "استفاده از دستگاه‌های قابل حمل و خانگی",
      "تحلیل سیگنال‌های مغزی، تنفس، ضربان قلب و حرکات",
      "ارائه‌ی گزارش تخصصی برای هر بیمار",
    ],
    cta: { label: "رزرو تست خواب", url: "/booking" },
  },
  {
    title: "درمان اختلالات ریتم شبانه‌روزی",
    desc: "برای شیفت‌کاران و کسانی که ساعت بیولوژیکی‌شان دچار اختلال شده",
    icon: <Clock className="h-8 w-8 text-purple-500" />,
    details: [
      "تنظیم ساعت خواب با نوردرمانی",
      "ارزیابی سطح ملاتونین بدن",
      "پیشنهاد برنامه‌ خوابی شخصی‌سازی‌شده",
    ],
  },
  {
    title: "مشاوره و آموزش خواب سالم",
    desc: "برای همه‌ی افراد در هر سن و موقعیت شغلی",
    icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
    details: [
      "آموزش به خانواده‌ها، دانش‌آموزان و مدیران",
      "پیشگیری از مشکلات خواب قبل از حاد شدن",
      "ارائه‌ی بروشورها و دوره‌های آموزشی",
    ],
  },
  {
    title: "مشاوره آنلاین پزشکی خواب",
    desc: "دسترسی آسان به خدمات درمانی از هرکجا که هستید",
    icon: <MonitorSmartphone className="h-8 w-8 text-green-500" />,
    details: [
      "مشاوره و ارزیابی آنلاین از طریق واتساپ، گوگل میت و ...",
      "ارسال مدارک و فرم‌ها به‌صورت دیجیتال",
      "صرفه‌جویی در زمان و هزینه رفت‌و‌آمد",
    ],
    cta: { label: "شروع ویزیت آنلاین", url: "/contact" },
  },
];

export const FAQ_ITEMS: { title: string; desc?: string }[] = [
  {
    title: "سوالات متداول",
  },
  {
    title: "تست خواب چیست؟",
    desc: "این تست برای تشخیص بسیاری از اختلالات خواب به عنوان روش استاندار طلایی (Gold Standard) محسوب می شود. یک تست چند پارامتری که عملکرد تعدادی از ارگان ها و سیستم های بدن انسان را ثبت می کند.",
  },
  {
    title: "در تست خواب چه فاکتور هایی ضبط و بررسی می گردند؟",
    desc: "مراحل مختلف خواب (خواب سبک، عمیق و رویا).امواج مغزی، قلبی، ثبت حرکات عضله، حرکات چشم، جریان هوایی بینی و دهان، حرکات قفسه سینه و شکم، درصد اشباع اکسیژن، موقعیت بدن حین خواب.",
  },
  {
    title: "تست خواب چگونه انجام می شود؟",
    desc: "در محل کلینیک در محیطی شبیه خانه با حضور تکنیسین، در ساعاتی از شبانه روز(معمولا شب) که فرد بتواند به راحتی بخوابد، بدون ورود به دستگاه و بدون تزریق هر نوع دارویی.",
  },
  {
    title: "آیا تست خواب درد و یا اشعه دارد؟",
    desc: "خیر، به راحتی مثل گرفتن نوار قلب جند سنسور به فرد وصل می شود و فرد میتواند به هر سمتی که دوست دارد بچرخد و بخوابد.",
  },
  {
    title: "تست خواب برای چه مواردی استفاده می شود؟",
    desc: "در موارد شک به وجود آپنه یا قطع تنفس یا در صورت وجود این علائم: خر و پف، فشار خون، خستگی بعد از بیداری، خواب آلودگی روزانه، مشکلات حافظه، تنفس دهانی در خواب، سردرد صبحگاحی، خواب ناآرام، پرتحرکی کودکان."
  }
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

export const ABOUT_TABS: TabConfig[] = [
  {
    value: "تحصیلات",
    label: "تحصیلات",
    icon: <GraduationCap className="h-4 w-4" />,
    component: <EducationList />,
  },
  {
    value: "سوابق کاری",
    label: "سوابق کاری",
    icon: <Briefcase className="h-4 w-4" />,
    component: <ExperienceList />,
  },
  {
    value: "افتخارات",
    label: "افتخارات",
    icon: <Trophy className="h-4 w-4" />,
    component: <HonorsList />,
  },
];

export const CONTACT_ITEMS: {
  title: string;
  desc?: string;
  value?: string;
  icon?: React.ReactNode;
}[] = [
  {
    title: "در تماس باشید",
    desc: "برای دریافت اطلاعات، رزرو نوبت یا ارتباط با کلینیک خواب، از طریق اطلاعات تماس زیر اقدام کنید.",
  },
  {
    title: "اینستاگرام",
    desc: "dr.imani.sleepclinic@",
    value: "https://www.instagram.com/dr.imani.sleepclinic",
    icon: <InstagramLogoIcon height={30} width={30} />,
  },
  {
    title: "شماره تماس",
    desc: "۰۴۱-۳۳۳۵۰۳۵۷",
    value: "tel:041-3335-0357",
    icon: <PhoneIcon height={30} width={30} />,
  },
  {
    title: "آدرس",
    desc: "تبریز، خیابان آزادی، سه راه گلگشت، ساختمان گلگشت، طبقه چهارم",
    icon: <MapPin height={30} width={30} />,
  },
];

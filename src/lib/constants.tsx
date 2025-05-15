import {
  InstagramLogoIcon,
  Link2Icon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import { MailIcon, MapPin, PhoneIcon } from "lucide-react";

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
  { title: string; path?: string; icon?: React.ReactNode }[]
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
    },
    {
      title: "912 345 6789",
      icon: <Link2Icon width={20} height={20} />,
    },
    {
      title: "آبرسان - نرسیده به قنادی تشریفات - طبقه 3",
      icon: <SewingPinIcon width={20} height={20} />,
    },
  ],
};

export const SERVICES_ITEMS: { title: string; desc?: string }[] = [
  {
    title: "خدمات ما در کلینیک",
  },
  {
    title: "درمان ریشه ای بی خوابی",
    desc: " با متد های بروز و تایید شده در مقیاس جهانی",
  },
  {
    title: "درمان آپنه",
    desc: "یکی از بزرگترین عوامل تهدید کننده ی سلامتی",
  },
  {
    title: "مانیتورینک و تحلیل شاخص های موثر در خواب",
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

export const ABOUT_ME_ITEMS: { title: string; desc?: string }[] = [
  {
    title: "درباره من",
  },
  {
    title: "سوابق کاری",
    desc: " با متد های بروز و تایید شده در مقیاس جهانی",
  },
  {
    title: "سوابق تحصیلی",
    desc: "ت بروزتزین و دقیق ترین ابزار موجود در بازار",
  },
  {
    title: "افتخارات",
    desc: "یکی از بزرگترین عوامل تهدید کننده ی سلامتی",
  },
];

export const CONTACT_ITEMS: {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}[] = [
  {
    title: "تماس با من",
  },
  {
    title: "ایمیل",
    desc: "vida.imani@gmail.con",
    icon: <MailIcon />,
  },
  {
    title: "شماره تماس",
    desc: "+98-914-123-2526",
    icon: <PhoneIcon />,
  },
  {
    title: "آدرس",
    desc: "آبرسان - نرسیده به قنادی تشریفات - طبقه 3",
    icon: <MapPin />,
  },
];

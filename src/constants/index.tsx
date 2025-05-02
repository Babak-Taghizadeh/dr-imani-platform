import {
  InstagramLogoIcon,
  Link2Icon,
  SewingPinIcon,
} from "@radix-ui/react-icons";

export const NAV_ITEMS: { title: string; path: string }[] = [
  {
    title: "وبلاگ",
    path: "/blogs",
  },
  {
    title: "تماس با ما",
    path: "/contact",
  },
  {
    title: "درباره من",
    path: "/about",
  },
  {
    title: "خانه",
    path: "/",
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

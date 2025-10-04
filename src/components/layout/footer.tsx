import { FOOTER_ITEMS } from "@/lib/constants";
import Link from "next/link";
import {
  Pill,
  Moon,
  Bed,
  Activity,
  Brain,
  Stethoscope,
  Clock,
  Zap,
  Star,
  Shield,
  Leaf,
  Sparkles,
  Droplets,
  Sun,
  Cloud,
  Waves,
  Lightbulb,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="from-secondary via-secondary/70 to-primary/10 relative mt-auto overflow-hidden border-t bg-gradient-to-b">
      {/* Background Icons */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        {/* Large icons */}
        <Pill className="text-primary absolute top-8 left-24 h-8 w-16" />
        <Moon className="text-primary absolute top-16 right-12 h-12 w-12" />

        {/* Medium icons */}
        <Bed className="text-primary absolute top-32 left-1/3 h-5 w-5" />
        <Activity className="text-primary absolute top-28 right-1/4 h-5 w-5" />
        <Brain className="text-primary absolute bottom-32 left-1/3 h-5 w-5" />
        <Stethoscope className="text-primary absolute right-1/4 bottom-28 h-5 w-5" />
        <Clock className="text-primary absolute top-40 left-1/4 h-4 w-4" />
        <Zap className="text-primary absolute top-36 right-1/3 h-4 w-4" />

        {/* Small icons */}
        <Star className="text-primary absolute top-24 left-1/2 h-3 w-3" />
        <Shield className="text-primary absolute top-20 right-1/2 h-3 w-3" />
        <Leaf className="text-primary absolute bottom-24 left-1/2 h-3 w-3" />
        <Sparkles className="text-primary absolute right-1/2 bottom-20 h-3 w-3" />
        <Droplets className="text-primary absolute top-44 left-1/6 h-3 w-3" />
        <Sun className="text-primary absolute top-48 right-1/6 h-3 w-3" />
        <Cloud className="text-primary absolute bottom-16 left-1/6 h-3 w-3" />
        <Waves className="text-primary absolute right-1/6 bottom-12 h-3 w-3" />
        <Lightbulb className="text-primary absolute top-1/2 left-1/6 h-3 w-3" />
        <Moon className="text-primary absolute bottom-1/3 left-1/4 h-3 w-3" />
        <Pill className="text-primary absolute right-1/4 bottom-1/3 h-3 w-3" />
        <Activity className="text-primary absolute top-1/3 left-1/5 h-3 w-3" />
        <Brain className="text-primary absolute top-1/3 right-1/5 h-3 w-3" />
        <Bed className="text-primary absolute bottom-1/4 left-1/5 h-3 w-3" />
        <Stethoscope className="text-primary absolute right-1/5 bottom-1/4 h-3 w-3" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <h6 className="text-primary text-3xl font-bold">
              {FOOTER_ITEMS.brand[0].title}
            </h6>
            <p className="text-accent-foreground text-sm font-light tracking-tighter md:text-lg!">
              {FOOTER_ITEMS.brand[1].title}
            </p>
          </div>

          <ul className="hidden flex-col gap-4 md:flex">
            {FOOTER_ITEMS.nav.map((item, index) =>
              index === 0 ? (
                <li key={item.title}>
                  <h5 className="text-primary mb-2 text-xl font-semibold">
                    {item.title}
                  </h5>
                </li>
              ) : (
                <li key={item.title}>
                  <Link
                    href={item.path!}
                    className="text-accent-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <ul className="flex flex-col gap-4">
            {FOOTER_ITEMS.contact.map((item, index) =>
              index === 0 ? (
                <li key={item.title}>
                  <h5 className="text-primary mb-2 text-xl font-semibold">
                    {item.title}
                  </h5>
                </li>
              ) : (
                <li key={item.title}>
                  {item.value ? (
                    <Link
                      className="group text-accent-foreground hover:text-primary flex items-center gap-3 transition-colors"
                      href={item.value}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="transition-transform group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="hover:underline">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-accent-foreground flex items-center gap-3">
                      <span>{item.icon}</span>
                      {item.title}
                    </p>
                  )}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="border-primary/10 text-accent-foreground mt-12 border-t pt-8 text-center text-sm">
          <p className="text-accent-foreground leading-6 text-sm">
            ۲۰۲۵ © کلیه حقوق مادی و معنوی این وب‌سایت برای دکتر ویدا ایمانی
            محفوظ است. | طراحی و توسعه توسط{" "}
            <Link
              href="https://babakcreates.com"
              className="text-[#2563eb] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Babak Taghizadeh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

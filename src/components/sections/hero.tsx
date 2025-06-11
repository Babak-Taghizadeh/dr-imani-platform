import { Button } from "../ui/button";
import Link from "next/link";
import HeroBackgroundCarousel from "./hero-background-carousel";

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full lg:h-[500px]">
      <HeroBackgroundCarousel />
      <div className="text-background absolute top-5 right-4 z-10 flex flex-col items-start gap-2 lg:top-10 lg:right-14 lg:gap-4">
        <h1 className="text-shadow text-2xl font-bold lg:text-3xl">
          تشخیص و درمان اختلالات خواب
        </h1>
        <p className="max-w-[300px] text-right text-sm leading-relaxed font-semibold tracking-tight lg:max-w-[400px] lg:text-lg!">
          اولین مرکز رسمی و دارای مجوز از معاونت درمان دانشگاه علوم پزشکی تبریز
          در شمالغرب کشور
        </p>
        <Button className="text-lg font-bold" size="lg" asChild>
          <Link
            href="https://boghrat.com/dr/vida-imani"
            rel="noopener noreferrer"
            target="_blank"
            
          >
            نوبت دهی
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;

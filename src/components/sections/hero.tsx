import { Button } from "../ui/button";
import Link from "next/link";
import HeroBackgroundCarousel from "./hero-background-carousel";

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full lg:h-[500px]">
      <HeroBackgroundCarousel />
      <div className="absolute top-6 right-6 z-10 flex flex-col items-start gap-4 text-white lg:top-16 lg:right-20">
        <h1 className="text-shadow text-xl font-bold lg:text-3xl">
          کمک به بهبود کیفیت و سلامت خواب
        </h1>
        <p className="max-w-[300px] text-right text-sm leading-relaxed lg:max-w-[400px] lg:text-base">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده
          از طراحان گرافیک است
        </p>
        <Button asChild>
          <Link
            href="https://doctoreto.com/doctor/dr-vida-imani/ZaEBBZ"
            target="_blank"
          >
            رزور نوبت
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;

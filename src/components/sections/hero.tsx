import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Sleep1 from "../../../public/sleep2.jpg";
import Sleep2 from "../../../public/sleep.jpeg";

const heroImages = [
  {
    src: Sleep1,
    alt: "تصویر خواب سالم",
    title: "کمک به بهبود کیفیت و سلامت خواب",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
  },
  {
    src: Sleep2,
    alt: "خوابیدن",
    title: "درمان اختلالات خواب",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
  },
  {
    src: Sleep1,
    alt: "مشاوره خواب",
    title: "مشاوره تخصصی خواب",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
  },
];

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full lg:h-[500px]">
      <Carousel opts={{ loop: true }} className="h-full w-full">
        <CarouselContent className="h-[300px] lg:h-[500px]">
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div dir="rtl" className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-cover brightness-[0.4]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden lg:flex" />
        <CarouselNext className="right-4 hidden lg:flex" />
      </Carousel>
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

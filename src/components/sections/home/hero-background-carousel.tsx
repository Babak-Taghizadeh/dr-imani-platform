"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Sleep1 from "../../../../public/images/pic6.jpg";
import Sleep2 from "../../../../public/images/pic7.jpg";
import Sleep3 from "../../../../public/images/pic8.jpg";

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
    src: Sleep3,
    alt: "تصویر خواب سالم",
    title: "کمک به بهبود کیفیت و سلامت خواب",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
  },
];
const HeroBackgroundCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
        }),
      ]}
      className="h-full w-full"
    >
      <CarouselContent className="h-[300px] lg:h-[600px]">
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div
              dir="rtl"
              className="relative h-full w-full"
              aria-label={`اسلاید ${index + 1}: ${image.title}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                sizes="100vw"
                quality={90}
                placeholder="blur"
                className="object-cover brightness-[0.4]"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroBackgroundCarousel;

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
  },
  {
    src: Sleep2,
    alt: "خوابیدن",
    title: "درمان اختلالات خواب",
  },
  {
    src: Sleep3,
    alt: "تصویر خواب سالم",
    title: "کمک به بهبود کیفیت و سلامت خواب",
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
      aria-roledescription="carousel"
      aria-label="اسلایدهای تصویری کلینیک خواب"
    >
      <CarouselContent className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        {heroImages.map((image, index) => (
          <CarouselItem
            key={index}
            aria-roledescription="slide"
            aria-label={`اسلاید ${index + 1} از ${heroImages.length}`}
          >
            <div dir="rtl" className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="100vw"
                quality={65}
                placeholder="blur"
                className="object-cover brightness-[0.4]"
                aria-hidden="false"
                role="img"
              />
              <span className="sr-only">{image.title}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroBackgroundCarousel;

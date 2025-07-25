import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface PicListProps {
  pic: StaticImageData;
  alt: string;
  theme: "dark" | "light";
  InfoElement: React.ReactNode;
  orientation: "portrait" | "landscape";
}

const PicList = ({
  pic,
  theme,
  InfoElement,
  alt,
  orientation,
}: PicListProps) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-12 px-8 py-6 md:justify-center md:gap-12 md:px-8 md:py-12 lg:min-h-[780px] lg:flex-row xl:min-h-[710px]",
        theme == "dark"
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      )}
    >
      <div className="flex items-center justify-center lg:w-1/2">
        <Image
          src={pic}
          alt={alt}
          className={cn(
            "h-auto w-auto rounded-lg object-contain",
            orientation === "portrait" ? "max-h-[600px]" : "max-h-[450px]",
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          placeholder="blur"
          loading="lazy"
          fill={false}
        />
      </div>
      {InfoElement}
    </section>
  );
};

export default PicList;

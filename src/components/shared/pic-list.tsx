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
        "flex flex-col gap-8 p-4 md:justify-center md:gap-12 md:px-8 md:py-12 lg:min-h-[800px] lg:flex-row lg:justify-evenly lg:gap-0 xl:min-h-[810px]",
        theme === "dark"
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
            orientation === "portrait" ? "max-h-[650px]" : "max-h-[450px]",
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          placeholder="blur"
          loading="eager"
        />
      </div>
      {InfoElement}
    </section>
  );
};

export default PicList;

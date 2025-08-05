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
        "flex flex-col-reverse gap-8 px-4 py-8 md:justify-center md:gap-12 md:px-8 md:py-12 lg:min-h-[810px] lg:flex-row lg:justify-evenly lg:gap-0",
        theme === "dark"
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      )}
    >
      {InfoElement}
      <div
        className={cn(
          "flex items-center justify-center lg:w-1/2 xl:w-[40%]",
          "max-w-full",
        )}
      >
        <Image
          src={pic}
          alt={alt}
          className={cn(
            "max-h-full w-auto rounded-lg object-contain",
            orientation === "portrait" ? "max-h-[650px]" : "max-h-[450px]",
          )}
          sizes="(max-width: 768px) 80vw, 50vw"
          quality={75}
          placeholder="blur"
          priority
        />
      </div>
    </section>
  );
};

export default PicList;

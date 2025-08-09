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
        "flex flex-col-reverse gap-8 px-4 py-8 md:justify-center md:gap-12 md:px-8 md:py-12 xl:min-h-[810px] xl:flex-row xl:justify-evenly xl:gap-0",
        theme === "dark"
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      )}
    >
      {InfoElement}
      <div className="flex max-w-full items-center justify-center xl:w-[40%]">
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
          loading={orientation === "portrait" ? "eager" : "lazy"}
        />
      </div>
    </section>
  );
};

export default PicList;

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface PicListProps {
  pic: StaticImageData;
  theme: "dark" | "light";
  InfoElement: React.ReactNode;
}

const PicList = ({ pic, theme, InfoElement }: PicListProps) => {
  return (
    <section
      className={cn(
        "flex min-h-[575px] flex-col gap-12 p-4 md:justify-center md:gap-12 md:px-8 md:py-12 lg:flex-row",
        theme == "dark"
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      )}
    >
      <div className="flex justify-center lg:w-1/2">
        <Image
          src={pic}
          alt="خواب"
          className="rounded-lg object-cover sm:w-5/6"
          priority
        />
      </div>
      {InfoElement}
    </section>
  );
};

export default PicList;

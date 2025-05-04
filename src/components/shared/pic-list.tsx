import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface PicListProps {
  items: {
    title: string;
    desc?: string;
  }[];
  pic: StaticImageData;
  theme: "dark" | "light";
}

const PicList = ({ items, pic, theme }: PicListProps) => {
  return (
    <section
      className={cn(
        "flex min-h-[540px] flex-col gap-12 px-8 py-12 md:justify-center md:gap-16 lg:flex-row",
        theme == "dark"
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      )}
    >
      <div className="flex justify-center md:flex-1/2">
        <Image
          src={pic}
          alt="خواب"
          className="rounded-lg object-cover xl:w-3/4"
        />
      </div>
      <ul className="flex flex-col md:flex-1/2 md:gap-4">
        {items.map((item, index) =>
          index == 0 ? (
            <li key={item.title}>
              <h4 className="mb-4 text-3xl font-bold">{item.title}</h4>
            </li>
          ) : (
            <li className="py-2 lg:p-5" key={item.title}>
              <h5 className="text-xl font-semibold">{item.title}</h5>
              <p className="mt-2 font-light text-gray-500">{item.desc}</p>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default PicList;

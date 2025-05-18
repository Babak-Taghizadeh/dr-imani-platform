"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Direction } from "@/lib/types";
import { SERVICES_ITEMS } from "@/lib/constants";
import getInitialAnimation from "@/utils/get-initial-animation";
import getCardStyle from "@/utils/get-card-style";
import ServiceCard from "../sections/service-card";

const ServiceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>("right");
  const totalProjects = SERVICES_ITEMS.length;

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  };

  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-between overflow-hidden rounded-2xl lg:h-auto lg:w-1/2 lg:justify-around">
      <h1 className="text-xl font-bold md:text-3xl">
        خدمات و سرویس های کلینیک
      </h1>
      <div className="relative w-full max-w-4xl">
        <AnimatePresence initial={false} custom={direction}>
          {SERVICES_ITEMS.map((project, index) => {
            const style = getCardStyle(index, currentIndex, totalProjects);
            if (!style) return null;

            return (
              <motion.div
                key={`${project.title}-${currentIndex}`}
                custom={direction}
                initial={getInitialAnimation(
                  index,
                  direction,
                  currentIndex,
                  totalProjects,
                )}
                animate={style}
                exit={{ opacity: 0 }}
                transition={{
                  type: "tween",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <ServiceCard {...project} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <Button size="icon" variant="outline" onClick={handleNext}>
          <ChevronRight />
        </Button>
        <Button size="icon" variant="outline" onClick={handlePrev}>
          <ChevronLeft />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCarousel;

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Direction } from "@/lib/types";
import { SERVICES_ITEMS } from "@/lib/constants";
import getInitialAnimation from "@/utils/get-initial-animation";
import getCardStyle from "@/utils/get-card-style";
import SectionHeader from "../../shared/section-header";
import ServiceCard from "./service-card";

const ServiceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>("right");
  const [isPaused, setIsPaused] = useState(false);
  const totalProjects = SERVICES_ITEMS.length;

  const handlePrev = useCallback(() => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const handleNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, handlePrev]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="flex min-h-[450px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl sm:min-h-[500px] md:min-h-[550px] md:gap-0 xl:h-auto xl:w-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SectionHeader title="خدمات و سرویس های کلینیک" />
      <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[350px] md:h-[400px]">
        <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px]">
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
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1,
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                >
                  <ServiceCard {...project} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={handleNext}
          className="h-8 w-8 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrev}
          className="h-8 w-8 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCarousel;

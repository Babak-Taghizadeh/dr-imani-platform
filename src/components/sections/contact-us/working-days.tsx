"use client";

import { motion } from "framer-motion";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EVEN_DAYS, PERSIAN_WEEKDAYS } from "@/lib/constants";

const WorkingDays = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary/10 border-primary/30 rounded-xl border p-4 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="bg-primary/20 text-primary w-fit rounded-lg p-2 sm:p-2">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-background text-base font-bold sm:text-lg md:text-xl">
              روزهای ویزیت در کلینیک
            </h3>

            <div className="mt-5 grid grid-cols-4 gap-1 sm:grid-cols-7 sm:gap-2 lg:grid-cols-4 xl:grid-cols-7">
              {PERSIAN_WEEKDAYS.map((day) => (
                <motion.div
                  key={day.id}
                  whileHover={{ scale: EVEN_DAYS.includes(day.id) ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center rounded-lg p-1 text-xs sm:p-2 sm:text-sm ${
                    EVEN_DAYS.includes(day.id)
                      ? "bg-primary text-white"
                      : "bg-background/10 text-background/50"
                  }`}
                >
                  <span className="hidden sm:inline-block">{day.short}</span>
                  <span className="text-[0.65rem] leading-tight sm:mt-1 sm:text-sm sm:font-medium">
                    {day.name.split("‌").join("")}{" "}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-secondary/80 px-1 text-xs sm:px-0 sm:text-sm">
          روزهای زوج
          <span className="hidden sm:inline"> (شنبه، دوشنبه و چهارشنبه)</span>
        </p>

        <Link
          href="https://boghrat.com/dr/vida-imani"
          rel="noopener noreferrer"
          target="_blank"
          className={cn(
            buttonVariants({ size: "sm", variant: "default" }),
            "group mt-2 w-fit self-end text-sm sm:mt-3 sm:text-base",
            "px-4 py-2 sm:py-2.5", // Adjusted padding for mobile
          )}
        >
          رزرو نوبت اینترنتی
          <ArrowLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default WorkingDays;

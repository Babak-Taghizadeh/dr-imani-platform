"use client";

import { Button } from "../../ui/button";
import Link from "next/link";
import HeroBackgroundCarousel from "./hero-background-carousel";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <HeroBackgroundCarousel />

      <div className="absolute inset-0 z-10 flex flex-col items-end justify-center px-4 text-center sm:items-start sm:px-8 sm:text-right">
        <div className="flex max-w-2xl flex-col items-center space-y-4 sm:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-3xl leading-tight font-extrabold text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
              راهکارهای تخصصی
            </span>
            <br />
            <span className="text-white">برای خواب بهتر</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center text-sm leading-relaxed text-white/90 drop-shadow-md sm:text-base md:text-lg lg:max-w-[80%]"
          >
            نخستین مرکز فوق‌تخصصی تشخیص و درمان اختلالات خواب در شمال‌غرب کشور،
            دارای مجوز رسمی از دانشگاه علوم پزشکی تبریز.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="pt-2"
          >
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              size="lg"
              asChild
            >
              <Link
                href="https://boghrat.com/dr/vida-imani"
                rel="noopener noreferrer"
                target="_blank"
              >
                نوبت دهی اینترنتی
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

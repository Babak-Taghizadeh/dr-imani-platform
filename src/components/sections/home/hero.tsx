"use client";

import { Button } from "../../ui/button";
import Link from "next/link";
import HeroBackgroundCarousel from "./hero-background-carousel";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full lg:h-[600px]">
      <HeroBackgroundCarousel />
      <div className="text-background absolute top-5 right-4 z-10 flex flex-col items-start gap-3 lg:top-10 lg:right-14 lg:gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text p-1 text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg lg:text-4xl xl:text-5xl"
        >
          راهکارهای تخصصی برای خواب بهتر
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-[300px] text-right text-sm leading-relaxed font-medium tracking-wide text-white/90 drop-shadow-md lg:max-w-[550px] lg:text-lg xl:text-xl"
        >
          نخستین مرکز فوق‌تخصصی تشخیص و درمان اختلالات خواب در شمال‌غرب کشور،
          دارای مجوز رسمی از معاونت درمان دانشگاه علوم پزشکی تبریز. همراه شما
          برای بازگشت به خواب آرام.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            className="from-primary/60 to-primary hover:from-purple-400-700 transform bg-gradient-to-r text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:to-purple-700 hover:shadow-xl"
            size="lg"
            asChild
          >
            <Link
              href="https://boghrat.com/dr/vida-imani"
              rel="noopener noreferrer"
              target="_blank"
            >
              نوبت دهی
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

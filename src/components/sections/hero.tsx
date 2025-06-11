"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import HeroBackgroundCarousel from "./hero-background-carousel";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative h-[300px] w-full lg:h-[500px]">
      <HeroBackgroundCarousel />
      <div className="text-background absolute top-5 right-4 z-10 flex flex-col items-start gap-3 lg:top-10 lg:right-14 lg:gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg lg:text-4xl xl:text-5xl"
        >
          تشخیص و درمان اختلالات خواب
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-[320px] text-right text-sm leading-relaxed font-medium tracking-wide text-white/90 drop-shadow-md lg:max-w-[450px] lg:text-lg xl:text-xl"
        >
          اولین مرکز رسمی و دارای مجوز از معاونت درمان دانشگاه علوم پزشکی تبریز
          در شمالغرب کشور
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

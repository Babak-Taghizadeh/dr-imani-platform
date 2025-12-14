"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export function BookingHero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 py-12 md:py-16"
      aria-label="رزرو نوبت"
    >
      {/* Decorative background icons */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Calendar className="absolute top-8 left-6 h-16 w-16 text-white" />
        <Clock className="absolute top-6 right-4 h-12 w-12 text-white" />
        <CheckCircle className="absolute bottom-4 left-1/4 h-10 w-10 text-white" />
        <Calendar className="absolute right-1/3 bottom-16 h-8 w-8 text-white" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl leading-tight font-extrabold text-white drop-shadow-lg sm:text-4xl md:text-5xl"
          >
            <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
              رزرو نوبت اینترنتی
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-md sm:text-lg md:text-xl"
            aria-label="توضیحات رزرو نوبت"
          >
            به راحتی و در چند مرحله ساده، نوبت خود را رزرو کنید.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

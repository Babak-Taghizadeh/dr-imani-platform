"use client";

import { motion } from "motion/react";

const QuizHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-blue-800 to-slate-900 px-4 py-14 md:py-20">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl" />

      <div className="relative container mx-auto text-center md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-6 text-3xl font-bold text-white md:text-6xl lg:mb-10">
            پرسشنامه‌های جامع ارزیابی خواب
          </h1>
          <p className="text-background mx-auto max-w-3xl text-sm md:text-xl md:leading-8">
            با استفاده از پرسشنامه‌های علمی و معتبر، کیفیت خواب خود را ارزیابی
            کنید و راهنمایی‌های تخصصی دریافت کنید
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-background mt-8 flex flex-wrap justify-center gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span>پرسشنامه‌های علمی و معتبر</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
            <span>نتایج فوری و دقیق</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <span>توصیه‌های تخصصی</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizHeroSection;

"use client";

import { BookOpen } from "lucide-react";
import { motion } from "motion/react";

const NoContent = () => {
  return (
    <motion.div
      className="col-span-full mx-auto flex w-fit flex-col items-center justify-center rounded-2xl border p-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-6">
        <BookOpen className="text-muted-foreground/30 h-12 w-12" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="text-muted-foreground h-8 w-8 animate-pulse" />
        </div>
      </div>

      <motion.h3
        className="text-muted-foreground text-center text-xl font-medium"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        هیچ محتوایی برای نمایش وجود ندارد.
      </motion.h3>

      <motion.p
        className="text-muted-foreground/80 mt-3 max-w-md text-center text-sm leading-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        در حال آماده‌سازی مطالب جدید و ارزشمند هستیم. به زودی محتوای تخصصی در
        این بخش منتشر خواهد شد.
      </motion.p>
    </motion.div>
  );
};

export default NoContent;

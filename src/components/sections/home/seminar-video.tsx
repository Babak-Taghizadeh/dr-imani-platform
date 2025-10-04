"use client";

import { motion } from "motion/react";
import SectionHeader from "@/components/shared/section-header";

// Video configuration - Update this with the actual seminar video file path
const SEMINAR_VIDEO_CONFIG = {
  title: "سمینار تخصصی بیماری های قلبی و اختلالات خواب",
  description:
    "سمینار تخصصی بیماری‌های قلبی و اختلالات خواب در بهار ۱۴۰۴ در هتل پارس تبریز با حضور دبیران علمی آقای دکتر فریبرز اکبرزاده و خانم دکتر ویدا ایمانی برگزار شد و به بررسی تازه‌ترین یافته‌ها درباره ارتباط میان سلامت قلب و کیفیت خواب، روش‌های نوین تشخیص و درمان و نقش سبک زندگی در پیشگیری از بیماری‌ها پرداخت.",
  topics: [
    "تشخیص و درمان آپنه خواب",
    "روش‌های نوین درمان بی‌خوابی",
    "اهمیت خواب سالم در سلامت عمومی",
  ],
};

const SeminarVideo = () => {
  return (
    <section className="bg-background text-foreground flex flex-col gap-8 px-4 py-8 md:justify-center md:gap-12 md:px-8 md:py-14 xl:min-h-[600px] xl:items-center xl:justify-evenly">
      <SectionHeader
        title={SEMINAR_VIDEO_CONFIG.title}
        description={SEMINAR_VIDEO_CONFIG.description}
      />
      <div className="flex max-w-full items-center justify-center xl:w-[65%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl"
        >
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
            <video
              src="videos/seminar-video.mp4"
              title={SEMINAR_VIDEO_CONFIG.title}
              className="h-full w-full"
              controls
              preload="metadata"
              playsInline
              poster="/videos/seminar-poster.jpg"
            >
              <p className="text-muted-foreground p-4 text-center">
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند. لطفاً از مرورگر
                جدیدتری استفاده کنید.
              </p>
            </video>
          </div>

          <div className="bg-primary/20 absolute -top-3 -right-3 h-8 w-8 rounded-full"></div>
          <div className="bg-primary/30 absolute -bottom-3 -left-3 h-8 w-8 rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default SeminarVideo;

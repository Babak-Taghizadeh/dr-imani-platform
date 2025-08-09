"use client";
import { ArrowLeft } from "lucide-react";
import Avatar from "../../../../public/images/dr-imani-1.jpg";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SUMMARY_INFO } from "@/lib/constants";
import { motion } from "motion/react";

const ClinicSupervised = () => {
  return (
    <section className="bg-foreground mt-1 px-6 py-12 sm:py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="border-primary/80 relative h-40 w-40 overflow-hidden rounded-full border-4 shadow-lg sm:h-48 sm:w-48"
          >
            <Image
              src={Avatar}
              alt="دکتر ویدا ایمانی - فوق تخصص اختلالات خواب"
              fill
              className="object-cover"
              quality={50}
              priority
            />
          </motion.div>

          <h2 className="text-background text-center text-lg font-bold sm:text-xl md:text-2xl">
            مدیریت کلینیک زیرنظر پژوهشگر برتر جهانی اختلالات خواب
          </h2>

          <div className="flex flex-col items-start gap-6">
            <p className="text-background/80 text-base leading-relaxed sm:text-lg">
              <strong>دکتر ویدا ایمانی</strong>، عضو ۱٪ دانشمندان برتر جهان
              (۲۰۲۳-۲۰۲۴) با سابقه‌ای درخشان در:
            </p>

            <ul className="text-background/70 max-w-2xl list-inside list-disc space-y-2 text-right text-sm md:text-base">
              {SUMMARY_INFO.map((item) => (
                <li key={item} className="text-right">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className={cn(
                buttonVariants(),
                "self-center text-sm sm:text-base",
              )}
              aria-label="مشاهده کامل سوابق علمی دکتر ایمانی"
            >
              مشاهده اطلاعات بیشتر
              <ArrowLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicSupervised;

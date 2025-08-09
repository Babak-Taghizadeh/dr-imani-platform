"use client";

import SectionHeader from "@/components/shared/section-header";
import { REASONS_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const WhyChooseUs = () => {
  return (
    <section className="space-y-10 p-8 text-center md:p-14">
      <SectionHeader title="کلینیک تخصصی خواب با بالاترین استانداردها" />

      <div className="grid gap-8 text-right sm:grid-cols-2 lg:grid-cols-4">
        {REASONS_ITEMS.map(({ title, description }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.2,
              duration: 0.6,
              ease: "easeOut",
            }}
            className={cn(
              "bg-background h-full rounded-2xl border p-6 shadow-md",
              "flex flex-col justify-center transition-shadow duration-300 hover:shadow-xl",
            )}
          >
            <div className="text-primary mb-4 flex items-center justify-start gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <CheckCircle className="h-5 w-5 shrink-0" />
            </div>
            <p className="text-accent-foreground text-sm leading-relaxed">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;

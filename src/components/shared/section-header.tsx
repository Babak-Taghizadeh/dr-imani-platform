"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

const SectionHeader = ({
  title,
  description,
  className = "",
  theme = "light",
}: {
  title: string;
  description?: string;
  className?: string;
  theme?: "light" | "dark";
}) => {
  return (
    <section className={cn("text-center", className)}>
      <motion.h3
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className={cn(
          "bg-gradient-to-r bg-clip-text pb-6 text-2xl font-bold tracking-tight text-transparent md:text-4xl",
          theme === "dark"
            ? "from-background via-primary to-background brightness-125"
            : "from-foreground via-primary to-foreground",
        )}
      >
        {title}
      </motion.h3>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className={cn(
            "text-muted-foreground mx-auto max-w-2xl text-base leading-8 tracking-tight md:text-xl",
            theme === "dark" ? "text-muted-foreground" : "text-foreground/75",
          )}
        >
          {description}
        </motion.p>
      )}
    </section>
  );
};

export default SectionHeader;

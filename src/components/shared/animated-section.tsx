"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initial?: { opacity?: number; y?: number; scale?: number };
  animate?: { opacity?: number; y?: number; scale?: number };
  whileInView?: { opacity?: number; y?: number; scale?: number };
  viewport?: { once?: boolean; margin?: string };
  transition?: { delay?: number; duration?: number };
}

export function AnimatedSection({
  children,
  className = "",
  initial = { opacity: 0, y: 20 },
  animate,
  whileInView,
  viewport = { once: true },
  transition = { duration: 0.5 },
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

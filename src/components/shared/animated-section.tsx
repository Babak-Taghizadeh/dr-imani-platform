"use client";

import { motion, Transition } from "motion/react";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initial?: { opacity?: number; y?: number; x?: number; scale?: number };
  animate?: { opacity?: number; y?: number; x?: number; scale?: number };
  whileInView?: { opacity?: number; y?: number; x?: number; scale?: number };
  viewport?: { once?: boolean; margin?: string };
  transition?: Transition;
}

export function AnimatedSection({
  children,
  className = "",
  initial = { opacity: 0, y: 20 },
  animate,
  whileInView,
  viewport = { once: true },
  transition,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition ?? { duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { QuizConfig } from "@/lib/types";
import QuizCard from "./quiz-card";

interface QuizCardWrapperProps {
  quiz: QuizConfig;
  index: number;
  className?: string;
}

const QuizCardWrapper = ({ quiz, index, className }: QuizCardWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={cn("h-full w-full", className)}
    >
      <QuizCard quiz={quiz} />
    </motion.div>
  );
};

export default QuizCardWrapper;

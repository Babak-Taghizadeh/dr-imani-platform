"use client";

import { motion } from "motion/react";
import SectionHeader from "@/components/shared/section-header";
import QuizCardWrapper from "@/components/sections/quiz/quiz-card-wrapper";
import QuizInfoSection from "@/components/sections/quiz/quiz-info-section";
import { QuizConfig } from "@/lib/types";

interface QuizGridProps {
  quizzes: QuizConfig[];
}

const QuizGrid = ({ quizzes }: QuizGridProps) => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeader
            title="ارزیابی و بهبود کیفیت خواب"
            description="این ابزارهای دقیق به شما کمک می‌کنند تا مشکلات احتمالی خواب خود را شناسایی کرده و به درک عمیق‌تری از الگوهای خوابتان برسید."
            theme="light"
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <QuizCardWrapper
              key={quiz.id}
              quiz={quiz}
              index={index}
              className="w-full"
            />
          ))}
        </div>

        <QuizInfoSection />
      </div>
    </section>
  );
};

export default QuizGrid;

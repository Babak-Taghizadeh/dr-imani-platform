"use client";

import { motion } from "motion/react";
import { QuizConfig } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface QuizHeaderProps {
  quiz: QuizConfig;
}

const QuizHeader = ({ quiz }: QuizHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-4xl px-4 pt-8 text-center md:pt-10"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 flex justify-start"
      >
        <Link
          href="/quiz"
          className="border-primary bg-background inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md md:text-base"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت
        </Link>
      </motion.div>

      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-xl backdrop-blur-sm md:p-8">
        <h1 className="text-primary mb-8 text-2xl leading-10 font-bold tracking-tight md:text-4xl">
          {quiz.title}
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-slate-600 md:text-xl">
          {quiz.description}
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-slate-700">
              {quiz.questions.length} سوال
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-slate-700">
              پرسشنامه تخصصی
            </span>
          </div>
        </div>

        {quiz.hint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 inline-flex items-start gap-1 rounded-xl border-2 border-amber-200 bg-amber-50 px-6 py-4 shadow-sm sm:items-center"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-base">💡</span>
            </div>
            <p className="text-sm font-medium text-amber-800">{quiz.hint}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizHeader;

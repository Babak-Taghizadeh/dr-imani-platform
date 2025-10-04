"use client";

import { motion } from "motion/react";

const QuizLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <div
            className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-purple-400"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          در حال بارگذاری پرسشنامه
        </h3>
        <p className="text-gray-600">لطفاً صبر کنید...</p>
      </motion.div>
    </div>
  );
};

export default QuizLoading;

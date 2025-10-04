"use client";

import { motion } from "motion/react";

const QuizInfoSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16 rounded-2xl border border-blue-200 bg-purple-50 p-8"
    >
      <div className="text-center">
        <h3 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">
          نکات مهم قبل از شروع پرسشنامه
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">🎯</div>
            <h4 className="mb-2 font-semibold text-gray-900">دقت در پاسخ‌ها</h4>
            <p className="text-sm text-gray-600">
              برای دریافت نتایج دقیق، صادقانه به سوالات پاسخ دهید
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">⏱️</div>
            <h4 className="mb-2 font-semibold text-gray-900">زمان مناسب</h4>
            <p className="text-sm text-gray-600">
              پرسشنامه‌ها معمولاً بین ۵ تا ۱۰ دقیقه زمان می‌برند
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">📊</div>
            <h4 className="mb-2 font-semibold text-gray-900">نتایج فوری</h4>
            <p className="text-sm text-gray-600">
              بلافاصله پس از تکمیل پرسشنامه، نتایج و راهنمایی‌ها را دریافت کنید
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizInfoSection;

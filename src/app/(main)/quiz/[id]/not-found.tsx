"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

const QuizNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-md px-4 text-center"
      >
        <div className="mb-8">
          <AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            تست یافت نشد
          </h1>
          <p className="text-lg leading-relaxed text-gray-600">
            متأسفانه تست مورد نظر شما یافت نشد. لطفاً از لیست تست‌های موجود یکی
            را انتخاب کنید.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/quiz">
            <Button size="lg" className="flex w-full items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              مشاهده تست‌های موجود
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="flex w-full items-center gap-2"
            >
              <Home className="h-4 w-4" />
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizNotFound;

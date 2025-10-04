import QuizHeroSection from "@/components/sections/quiz/quiz-hero-section";
import QuizGrid from "@/components/sections/quiz/quiz-grid";
import { QUIZ_REGISTRY } from "@/lib/quiz-constants";
import { QuizConfig } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرسشنامه‌های ارزیابی خواب",
  description:
    "پرسشنامه‌های تخصصی ارزیابی کیفیت خواب و تشخیص اختلالات خواب شامل پرسشنامه Stop Bang برای آپنه خواب و پرسشنامه Epworth برای خواب‌آلودگی روزانه",
  keywords: [
    "پرسشنامه خواب",
    "ارزیابی کیفیت خواب",
    "پرسشنامه Stop Bang",
    "پرسشنامه Epworth",
    "آپنه خواب",
    "خواب‌آلودگی روزانه",
    "اختلالات خواب",
    "پرسشنامه تشخیص خواب",
    "ارزیابی خواب تبریز",
    "پرسشنامه خواب آنلاین",
    "غربالگری اختلالات خواب",
    "پرسشنامه خواب‌آلودگی",
    "تشخیص آپنه خواب",
    "پرسشنامه خواب دکتر ایمانی",
    "کلینیک خواب تبریز",
    "تست خواب",
    "تست stop bang",
    "تست epworth",
  ],
  openGraph: {
    title: "پرسشنامه‌های ارزیابی خواب | کلینیک تخصصی خواب دکتر ایمانی",
    description:
      "انجام پرسشنامه‌های تخصصی ارزیابی کیفیت خواب و تشخیص اختلالات خواب در کلینیک دکتر ایمانی تبریز",
    url: "/quiz",
    images: [
      {
        url: "/open-graph/home-fa.png",
        width: 1200,
        height: 630,
        alt: "پرسشنامه‌های ارزیابی خواب در کلینیک تخصصی خواب دکتر ایمانی تبریز",
      },
    ],
  },
  alternates: {
    canonical: "/quiz",
  },
  other: {
    "content-language": "fa-IR",
    author: "کلینیک خواب دکتر ایمانی",
  },
};

const QuizPage = () => {
  const quizzes = Object.values(QUIZ_REGISTRY) as QuizConfig[];

  return (
    <div className="bg-background min-h-screen">
      <QuizHeroSection />
      <QuizGrid quizzes={quizzes} />
    </div>
  );
};

export default QuizPage;

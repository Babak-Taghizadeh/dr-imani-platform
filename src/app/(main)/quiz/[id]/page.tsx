import { notFound } from "next/navigation";
import { Metadata } from "next";
import { QUIZ_REGISTRY } from "@/lib/quiz-constants";
import QuizPageWrapper from "@/components/sections/quiz/quiz-page-wrapper";
import QuizHeader from "@/components/sections/quiz/quiz-header";

interface QuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const quiz = QUIZ_REGISTRY[resolvedParams.id as keyof typeof QUIZ_REGISTRY];

  if (!quiz) {
    return {
      title: "پرسشنامه یافت نشد",
      description: "پرسشنامه مورد نظر یافت نشد",
    };
  }

  const quizKeywords = [
    "پرسشنامه خواب",
    "ارزیابی کیفیت خواب",
    "آپنه خواب",
    "اختلالات خواب",
    "پرسشنامه Stop Bang",
    "پرسشنامه Epworth",
    "خواب‌آلودگی روزانه",
    "خروپف",
    "پرسشنامه خواب آنلاین",
    "تشخیص اختلالات خواب",
    "کلینیک خواب دکتر ایمانی",
    "متخصص خواب تبریز",
    "پرسشنامه خواب رایگان",
    "ارزیابی ریسک آپنه خواب",
    "خواب‌آلودگی اپورث",
    "تست خواب",
    "تست stop bang",
    "تست epworth",
    "تست خواب رایگان",
  ];

  return {
    title: quiz.title,
    description: quiz.description,
    keywords: quizKeywords,
    openGraph: {
      title: `${quiz.title} | کلینیک خواب دکتر ایمانی`,
      description: quiz.description,
      url: `/quiz/${quiz.id}`,
      images: [
        {
          url: "/open-graph/home-fa.png",
          width: 1200,
          height: 630,
          alt: `${quiz.title} - کلینیک خواب دکتر ایمانی`,
        },
      ],
    },
    alternates: {
      canonical: `/quiz/${quiz.id}`,
    },
    other: {
      "content-language": "fa-IR",
      author: "کلینیک خواب دکتر ایمانی",
    },
  };
}

const QuizPage = async ({ params }: QuizPageProps) => {
  const resolvedParams = await params;
  const quiz = QUIZ_REGISTRY[resolvedParams.id as keyof typeof QUIZ_REGISTRY];

  if (!quiz) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <QuizHeader quiz={quiz} />
      <QuizPageWrapper quiz={quiz} />
    </div>
  );
};

export default QuizPage;

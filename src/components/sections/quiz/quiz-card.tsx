import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuizConfig } from "@/lib/types";
import { ArrowLeft, Moon, Brain, Clock } from "lucide-react";
import Link from "next/link";
import { getQuizColor, getBorderColor } from "./quiz-styling-helpers";

interface QuizCardProps {
  quiz: QuizConfig;
}

// Function to get appropriate icon for each quiz type
const getQuizIcon = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return Moon;
    case "Epworth":
      return Brain;
    default:
      return Clock;
  }
};

const QuizCard = ({ quiz }: QuizCardProps) => {
  const QuizIcon = getQuizIcon(quiz.id);

  return (
    <Card
      className={cn(
        "group relative h-full w-full overflow-hidden border-2 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-lg transition-all duration-500 hover:shadow-2xl",
        getBorderColor(quiz.id),
        getQuizColor(quiz.id),
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          getQuizColor(quiz.id),
        )}
      />

      <div
        className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl transition-all duration-500 group-hover:scale-150"
        aria-hidden="true"
      />

      <div
        className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-tr from-pink-400/20 to-orange-500/20 blur-xl transition-all duration-500 group-hover:scale-150"
        aria-hidden="true"
      />

      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-lg bg-blue-50 p-2 transition-colors duration-300 group-hover:bg-blue-100">
            <QuizIcon className="h-5 w-5 text-blue-600 transition-colors duration-300 group-hover:text-blue-700" />
          </div>
          <div className="flex-1">
            <CardTitle className="leading-7 font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700 md:text-lg">
              {quiz.title}
            </CardTitle>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{quiz.questions.length} سوال</span>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 mt-auto pt-0">
        <CardDescription className="mb-4 min-h-18 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700 md:text-base">
          {quiz.description}
        </CardDescription>

        <div className="mt-6">
          <Link href={`/quiz/${quiz.id}`}>
            <Button
              className="w-full transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
              size="lg"
            >
              <span>شروع ارزیابی</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;

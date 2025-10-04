"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResult, QuizConfig } from "@/lib/types";
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuizResultsProps {
  result: QuizResult;
  quiz: QuizConfig;
  onRestart: () => void;
}

const QuizResults = ({ result, quiz, onRestart }: QuizResultsProps) => {
  const getScoreColor = (score: number) => {
    // Special handling for Epworth quiz
    if (quiz.id === "Epworth") {
      if (score <= 7) return "text-green-600";
      if (score <= 9) return "text-yellow-600";
      if (score <= 15) return "text-orange-600";
      return "text-red-600";
    }

    // Default logic for other quizzes
    if (score <= quiz.goodScoreThreshold) return "text-green-600";
    if (score <= quiz.moderateScoreThreshold) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    // Special handling for Epworth quiz
    if (quiz.id === "Epworth") {
      if (score <= 7) return "bg-green-50 border-green-200";
      if (score <= 9) return "bg-yellow-50 border-yellow-200";
      if (score <= 15) return "bg-orange-50 border-orange-200";
      return "bg-red-50 border-red-200";
    }

    // Default logic for other quizzes
    if (score <= quiz.goodScoreThreshold) return "bg-green-50 border-green-200";
    if (score <= quiz.moderateScoreThreshold)
      return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getIcon = (score: number) => {
    // Special handling for Epworth quiz
    if (quiz.id === "Epworth") {
      if (score <= 7)
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      if (score <= 9)
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      if (score <= 15)
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }

    // Default logic for other quizzes
    if (score <= quiz.goodScoreThreshold)
      return <CheckCircle2 className="h-8 w-8 text-green-500" />;
    if (score <= quiz.moderateScoreThreshold)
      return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    return <AlertTriangle className="h-8 w-8 text-red-500" />;
  };

  const recommendations = Array.isArray(result.interpretation.recommendation)
    ? result.interpretation.recommendation
    : [result.interpretation.recommendation];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          className={cn("border-2 p-2 md:p-4", getScoreBgColor(result.score))}
        >
          <CardHeader className="text-center">
            <div className="mb-2 flex justify-center">
              {getIcon(result.score)}
            </div>
            <CardTitle
              className={cn("text-2xl font-bold", getScoreColor(result.score))}
            >
              {result.interpretation.level}
            </CardTitle>
            <div className="mt-2 font-bold text-gray-900 md:text-xl">
              امتیاز شما: {result.score} از {quiz.maxScore}
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-gray-900 md:text-xl">
              <Info className="h-5 w-5 text-blue-500" />
              توصیه‌ها و راهنمایی‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-2 sm:p-4"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 p-1 pt-2 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col justify-center gap-4 sm:flex-row"
      >
        <Link href="/quiz">
          <Button
            variant="outline"
            size="lg"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <ArrowRight className="h-4 w-4" />
            سایر پرسشنامه‌ها
          </Button>
        </Link>

        <Button
          className="text-background bg-gradient-to-r from-blue-600 to-purple-600 font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl md:px-6 md:py-4"
          size="lg"
          asChild
          aria-label="دریافت نوبت اینترنتی"
          tabIndex={0}
        >
          <Link
            href="https://boghrat.com/dr/vida-imani"
            rel="noopener noreferrer"
            target="_blank"
          >
            نوبت دهی اینترنتی
          </Link>
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          ارزیابی مجدد
        </Button>
      </motion.div>
    </div>
  );
};

export default QuizResults;

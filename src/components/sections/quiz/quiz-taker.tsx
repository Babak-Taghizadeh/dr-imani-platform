"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizConfig, QuizOption, QuizResult } from "@/lib/types";
import { calculateQuizResult, isQuizCompleted } from "@/lib/quiz-utils";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTakerProps {
  quiz: QuizConfig;
  onComplete: (result: QuizResult) => void;
}

const QuizTaker = ({ quiz, onComplete }: QuizTakerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: number; selectedOption: QuizOption }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = isQuizCompleted(
    currentQuestionIndex,
    quiz.questions.length,
  );

  const handleOptionSelect = (option: QuizOption) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, selectedOption },
    ];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const result = calculateQuizResult(newAnswers, quiz);
      setIsCompleted(true);
      setTimeout(() => onComplete(result), 1000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers.find(
        (a) => a.questionId === quiz.questions[currentQuestionIndex - 1].id,
      );
      setSelectedOption(previousAnswer?.selectedOption || null);
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-4 text-center"
      >
        <div className="mb-6">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">
          ارزیابی تکمیل شد!
        </h3>
        <p className="text-gray-600">در حال محاسبه نتایج...</p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            سوال {currentQuestionIndex + 1} از {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% تکمیل شده
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold text-gray-900">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={`${currentQuestionIndex}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "w-full rounded-lg border-2 p-4 text-right hover:shadow-md",
                      selectedOption === option
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      <AnimatePresence>
                        {selectedOption === option && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          قبلی
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? "تکمیل ارزیابی" : "بعدی"}
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuizTaker;

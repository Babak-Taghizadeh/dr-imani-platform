"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { QuizConfig, QuizResult } from "@/lib/types";
import QuizTaker from "@/components/sections/quiz/quiz-taker";
import QuizResults from "@/components/sections/quiz/quiz-results";

interface QuizPageWrapperProps {
  quiz: QuizConfig;
}

const QuizPageWrapper = ({ quiz }: QuizPageWrapperProps) => {
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleQuizComplete = (quizResult: QuizResult) => {
    setResult(quizResult);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setResult(null);
  };

  return (
    <motion.section
      className="py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        {!showResults ? (
          <QuizTaker quiz={quiz} onComplete={handleQuizComplete} />
        ) : (
          result && (
            <QuizResults
              result={result}
              quiz={quiz}
              onRestart={handleRestart}
            />
          )
        )}
      </div>
    </motion.section>
  );
};

export default QuizPageWrapper;

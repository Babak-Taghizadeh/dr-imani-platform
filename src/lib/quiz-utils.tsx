import { Brain, Clock, Users } from "lucide-react";
import { QuizConfig, QuizResult, QuizOption } from "./types";

export const getQuizIcon = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return <Brain className="h-5 w-5 text-blue-600" />;
    case "Epworth":
      return <Clock className="h-5 w-5 text-purple-600" />;
    default:
      return <Users className="h-5 w-5 text-green-600" />;
  }
};

export const getQuizColor = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20";
    case "Epworth":
      return "from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20";
    default:
      return "from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20";
  }
};

export const getBorderColor = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return "border-blue-200 hover:border-blue-300";
    case "Epworth":
      return "border-purple-200 hover:border-purple-300";
    default:
      return "border-green-200 hover:border-green-300";
  }
};

export const calculateQuizResult = (
  answers: { questionId: number; selectedOption: QuizOption }[],
  quiz: QuizConfig,
): QuizResult => {
  const totalScore = answers.reduce(
    (sum, answer) => sum + answer.selectedOption.score,
    0,
  );

  let interpretation;

  // Special handling for Epworth quiz with 4 ranges
  if (quiz.id === "Epworth") {
    if (totalScore <= 7) {
      interpretation = quiz.scoreInterpretations.good;
    } else if (totalScore <= 9) {
      interpretation = quiz.scoreInterpretations.moderate;
    } else if (totalScore <= 15) {
      interpretation = quiz.scoreInterpretations.needsReview;
    } else {
      interpretation = quiz.scoreInterpretations.low;
    }
  } else {
    // Default logic for other quizzes (Stop-Bang)
    if (totalScore <= quiz.goodScoreThreshold) {
      interpretation =
        quiz.scoreInterpretations.lowRisk || quiz.scoreInterpretations.good;
    } else if (totalScore <= quiz.moderateScoreThreshold) {
      interpretation =
        quiz.scoreInterpretations.moderateRisk ||
        quiz.scoreInterpretations.moderate;
    } else {
      interpretation =
        quiz.scoreInterpretations.highRisk ||
        quiz.scoreInterpretations.needsReview ||
        quiz.scoreInterpretations.low;
    }
  }

  return {
    score: totalScore,
    interpretation,
    answers,
  };
};

export const isQuizCompleted = (
  currentIndex: number,
  totalQuestions: number,
): boolean => {
  return currentIndex >= totalQuestions - 1;
};

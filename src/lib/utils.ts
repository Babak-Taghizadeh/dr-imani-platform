import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QuizScoreInterpretation } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Quiz utility functions
export function calculateQuizScore(
  answers: { questionId: number; selectedOption: { score: number } }[],
): number {
  return answers.reduce(
    (total, answer) => total + answer.selectedOption.score,
    0,
  );
}

export function getQuizInterpretation(
  score: number,
  quizConfig: {
    goodScoreThreshold: number;
    moderateScoreThreshold: number;
    scoreInterpretations: Record<string, QuizScoreInterpretation>;
  },
) {
  if (score <= quizConfig.goodScoreThreshold) {
    return (
      quizConfig.scoreInterpretations.lowRisk ||
      quizConfig.scoreInterpretations.good
    );
  } else if (score <= quizConfig.moderateScoreThreshold) {
    return (
      quizConfig.scoreInterpretations.moderateRisk ||
      quizConfig.scoreInterpretations.moderate
    );
  } else {
    return (
      quizConfig.scoreInterpretations.highRisk ||
      quizConfig.scoreInterpretations.needsReview ||
      quizConfig.scoreInterpretations.low
    );
  }
}

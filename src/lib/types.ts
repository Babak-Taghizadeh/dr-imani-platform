export interface Blog {
  id: number;
  title: string;
  slug: string;
  status: "ذخیره شده" | "منتشر شده";
  imageUrl: string;
  imageKey: string;
  content: string;
  createdAt: string;
  excerpt?: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  fileUrl: string;
  fileKey: string;
}

export type Direction = "left" | "right";

export interface EducationItem {
  degree: string;
  institution: string;
  years: string;
  description?: string;
  details?: string;
}

export interface ExperienceItem {
  position: string;
  hospital: string;
  years: string;
}

export interface HonorItem {
  title: string;
  year: string;
  description?: string;
}

export type TabType = "تحصیلات" | "سوابق کاری" | "افتخارات";

export interface TabConfig {
  value: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

// Quiz Types
export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizScoreInterpretation {
  level: string;
  color: string;
  recommendation: string | string[];
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  hint?: string;
  maxScore: number;
  goodScoreThreshold: number;
  moderateScoreThreshold: number;
  lowScoreThreshold: number;
  questions: QuizQuestion[];
  scoreInterpretations: {
    [key: string]: QuizScoreInterpretation;
  };
}

export interface QuizRegistry {
  [key: string]: QuizConfig;
}

export interface QuizResult {
  score: number;
  interpretation: QuizScoreInterpretation;
  answers: { questionId: number; selectedOption: QuizOption }[];
}

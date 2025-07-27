import { StaticImageData } from "next/image";

export interface Blog {
  id: string;
  title: string;
  status: "ذخیره شده" | "منتشر شده";
  imgPath: StaticImageData;
  content: string;
  createdAt: string;
  excerpt?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  fileUrl: string;
}

export type Direction = "left" | "right";

export interface EducationItem {
  degree: string;
  institution: string;
  years: string;
  description?: string;
  details?: string;
  field?: string;
  link?: string;
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

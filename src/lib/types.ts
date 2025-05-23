import { StaticImageData } from "next/image";

export interface Blog {
  id: string;
  title: string;
  status: "ذخیره شده" | "منتشر شده";
  img: StaticImageData;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  fileUrl: string;
}

export type Direction = "left" | "right";
import { Article } from "@/lib/types";
import { notFound } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const fetchArticle = async (id: string): Promise<Article> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/articles/${id}`);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      next: { tags: ["article"] },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }

      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "خطا در دریافت مقاله");
    }

    const data = await res.json();

    if (!data || typeof data !== "object" || !data.id) {
      throw new Error("فرمت مقاله نامعتبر است");
    }

    return data as Article;
  } catch (error) {
    console.error("Fetch article error:", error);
    throw new Error(
      error instanceof Error ? error.message : "خطای ناشناخته در دریافت مقاله",
    );
  }
};

export default fetchArticle;

import { Article } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const fetchArticles = async (
  page = 1,
  limit = 6,
  options?: RequestInit,
): Promise<{
  articles: Article[];
  totalPages: number;
}> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/articles`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
      next: { tags: ["articles"] },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "خطا در دریافت مقالات");
    }

    const data = await res.json();

    if (!data) {
      throw new Error("فرمت مقالات نامعتبر است");
    }

    return {
      articles: data.articles,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Fetch articles error:", error);
    throw new Error(
      error instanceof Error ? error.message : "خطای ناشناخته در دریافت مقالات",
    );
  }
};

export default fetchArticles;

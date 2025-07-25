import { Blog } from "@/lib/types";
import { notFound } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const fetchBlog = async (id: string): Promise<Blog> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/blogs/${id}`);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      next: { tags: ["blog"] },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }

      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "خطا در دریافت بلاگ");
    }

    const data = await res.json();

    if (!data || typeof data !== "object" || !data.id) {
      throw new Error("فرمت پاسخ بلاگ نامعتبر است");
    }

    return data as Blog;
  } catch (error) {
    console.error("Fetch blog error:", error);
    throw new Error(
      error instanceof Error ? error.message : "خطای ناشناخته در دریافت بلاگ",
    );
  }
};

export default fetchBlog;

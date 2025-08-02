import { Blog } from "@/lib/types";
import { notFound } from "next/navigation";

const fetchBlog = async (slug: string): Promise<Blog> => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 3000}`
        : "http://localhost:3000";

    const url = new URL(`${baseUrl}/api/blogs/${slug}`);
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

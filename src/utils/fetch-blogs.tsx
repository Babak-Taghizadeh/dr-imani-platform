import { Blog } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const fetchBlogs = async (
  page = 1,
  limit = 6,
  options?: RequestInit,
): Promise<{
  blogs: Blog[];
  totalPages: number;
}> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/blogs`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
      next: { tags: ["blogs"] },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "خطا در دریافت بلاگ ها");
    }

    const data = await res.json();
    if (!data) {
      throw new Error("Invalid response format");
    }

    return {
      blogs: data.blogs,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Fetch blogs error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "خطای ناشناخته در دریافت بلاگ ها",
    );
  }
};

export default fetchBlogs;

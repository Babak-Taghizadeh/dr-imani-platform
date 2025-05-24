import { Blog } from "@/lib/types";

const getBlogs = async (): Promise<Blog[]> => {
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("خطا در دریافت بلاگ ها.");

  return res.json();
};

export default getBlogs;

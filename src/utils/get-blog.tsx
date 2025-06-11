import { notFound } from "next/navigation";

const getBlog = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch blog");
  }

  return res.json();
};

export default getBlog;

import { MetadataRoute } from "next";
import { Blog } from "@/lib/types";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";

const BASE_URL = "https://drimanisleepclinic.com";
const MAX_PAGINATION_ITERATIONS = 20;
const ITEMS_PER_PAGE = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    return [
      createEntry(BASE_URL, now, "weekly", 1),
      createEntry(`${BASE_URL}/about`, now, "yearly", 0.8),
      createEntry(`${BASE_URL}/contact`, now, "yearly", 0.7),
      createEntry(`${BASE_URL}/articles`, now, "weekly", 0.6),
      createEntry(`${BASE_URL}/blogs`, now, "weekly", 0.7),

      ...(await fetchBlogEntries()),
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [
      createEntry(BASE_URL, now, "weekly", 1),
      createEntry(`${BASE_URL}/about`, now, "yearly", 0.8),
    ];
  }
}

function createEntry(
  url: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[0] {
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
  };
}

async function fetchBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  try {
    const blogs = await fetchAllBlogs();
    for (const blog of blogs) {
      entries.push(
        createEntry(
          `${BASE_URL}/blogs/${blog.slug}`,
          blog.createdAt ? new Date(blog.createdAt) : now,
          "weekly",
          0.7,
        ),
      );
    }
  } catch (error) {
    console.error("Failed to fetch blog entries:", error);
  }

  return entries;
}

async function fetchAllBlogs(): Promise<Blog[]> {
  const allBlogs: Blog[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (
    currentPage <= totalPages &&
    currentPage <= MAX_PAGINATION_ITERATIONS
  ) {
    try {
      const { blogs: items, totalPages: fetchedTotal } =
        await fetchPaginatedData<Blog>(
          "blogs",
          "blogs",
          currentPage,
          ITEMS_PER_PAGE,
        );

      allBlogs.push(...items);
      totalPages = fetchedTotal;
      currentPage++;

      if (currentPage > 1 && items.length === 0) break;
    } catch (error) {
      console.error(`Error fetching blogs page ${currentPage}:`, error);
      break;
    }
  }

  return allBlogs;
}

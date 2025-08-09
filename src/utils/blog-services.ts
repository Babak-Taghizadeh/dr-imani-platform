import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { deleteFile } from "@/lib/file-utils";
import { generateSlug } from "./slug-generator";
import { BlogFormData } from "@/lib/validation-schema";
import { generateExcerpt } from "./excerpt-generator";

export const createBlog = async (data: BlogFormData) => {
  const slug = generateSlug(data.title);
  const excerpt = generateExcerpt(data.content);

  const [blog] = await db
    .insert(blogs)
    .values({
      ...data,
      slug,
      excerpt,
      createdAt: new Date(),
    })
    .returning();

  return blog;
};

export const getBlogs = async (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      status: blogs.status,
      imageUrl: blogs.imageUrl,
      content: blogs.content,
      excerpt: blogs.excerpt,
      createdAt: blogs.createdAt,
      total: sql<number>`count(*) OVER()`.as("total"),
    })
    .from(blogs)
    .orderBy(desc(blogs.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    blogs: result,
    totalPages: Math.ceil((result[0]?.total ?? 0) / limit),
  };
};

export const getBlogBySlug = async (slug: string) => {
  const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug));

  if (!blog) {
    throw new Error("بلاگ پیدا نشد");
  }

  return blog;
};

export const updateBlog = async (slug: string, data: BlogFormData) => {
  const newSlug = generateSlug(data.title);
  const excerpt = generateExcerpt(data.content);
  const [blog] = await db
    .update(blogs)
    .set({
      ...data,
      slug: newSlug,
      excerpt,
      createdAt: new Date(),
    })
    .where(eq(blogs.slug, slug))
    .returning();

  return blog;
};

export const deleteBlogBySlug = async (slug: string) => {
  return db.transaction(async (tx) => {
    const [blog] = await tx
      .select({ slug: blogs.slug, imgPath: blogs.imageUrl })
      .from(blogs)
      .where(eq(blogs.slug, slug));

    if (!blog) {
      throw new Error("بلاگ پیدا نشد");
    }

    if (blog.imgPath) {
      await deleteFile(blog.imgPath).catch(console.error);
    }

    await tx.delete(blogs).where(eq(blogs.slug, slug));
  });
};

import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { deleteFile, saveUploadedFile } from "@/lib/file-utils";
import { BlogCreateSchema, BlogUpdateSchema } from "@/lib/api-validators";
import { z } from "zod";
import slugify from "slugify";
import customSlugGenerator from "./custom-slug-generator";

export const createBlog = async (data: z.infer<typeof BlogCreateSchema>) => {
  const { filePath, mimeType, fileSize } = await saveUploadedFile(data.image);
  const slug = customSlugGenerator(data.title);

  return db.transaction(async (tx) => {
    const [blog] = await tx
      .insert(blogs)
      .values({
        title: data.title,
        content: data.content,
        slug,
        status: data.status,
        imgPath: filePath,
        mimeType,
        fileSize,
        createdAt: new Date(),
      })
      .returning();
    return blog;
  });
};

export const getBlogs = async (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      status: blogs.status,
      img: blogs.imgPath,
      content: blogs.content,
      excerpt: sql<string>`
        CASE 
          WHEN length(regexp_replace(${blogs.content}, '<[^>]+>', '', 'g')) > 100
          THEN substring(regexp_replace(${blogs.content}, '<[^>]+>', '', 'g') from 1 for 100) || '...'
          ELSE regexp_replace(${blogs.content}, '<[^>]+>', '', 'g')
        END
      `.as("excerpt"),
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

export const updateBlog = async (
  slug: string,
  data: z.infer<typeof BlogUpdateSchema>,
) => {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ imgPath: blogs.imgPath })
      .from(blogs)
      .where(eq(blogs.slug, slug));

    if (!current) {
      throw new Error("بلاگ مورد نظر پیدا نشد.");
    }

    let filePath = current.imgPath;

    if (data.image instanceof File) {
      if (filePath) {
        try {
          await deleteFile(filePath);
        } catch (error) {
          console.error("خطا در حذف تصویر قبلی:", error);
        }
      }

      try {
        const uploadResult = await saveUploadedFile(data.image);
        filePath = uploadResult.filePath;
      } catch (error) {
        console.error("خطا در بارگذاری تصویر:", error);
        throw new Error("بارگذاری تصویر با خطا مواجه شد.");
      }
    }

    if (!data.title) {
      throw new Error("عنوان وارد نشده است.");
    }

    const newSlug = slugify(data.title, { lower: true, strict: true });

    const [updatedBlog] = await tx
      .update(blogs)
      .set({
        title: data.title,
        content: data.content,
        slug: newSlug,
        status: data.status,
        ...(filePath && { imgPath: filePath }),
      })
      .where(eq(blogs.slug, slug))
      .returning();

    return updatedBlog;
  });
};

export const deleteBlogBySlug = async (slug: string) => {
  return db.transaction(async (tx) => {
    const [blog] = await tx
      .select({ id: blogs.id, imgPath: blogs.imgPath })
      .from(blogs)
      .where(eq(blogs.slug, slug));

    if (!blog) {
      throw new Error("بلاگ پیدا نشد");
    }

    if (blog.imgPath) {
      await deleteFile(blog.imgPath).catch(console.error);
    }

    await tx.delete(blogs).where(eq(blogs.id, blog.id));
  });
};

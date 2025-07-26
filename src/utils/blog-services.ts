import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { deleteFile, saveUploadedFile } from "@/lib/file-utils";
import { BlogCreateSchema, BlogUpdateSchema } from "@/lib/api-validators";
import { z } from "zod";

export const createBlog = async (data: z.infer<typeof BlogCreateSchema>) => {
  const { filePath, mimeType, fileSize } = await saveUploadedFile(data.image);

  return db.transaction(async (tx) => {
    const [blog] = await tx
      .insert(blogs)
      .values({
        title: data.title,
        content: data.content,
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
      status: blogs.status,
      imgPath: blogs.imgPath,
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

export const getBlogById = async (id: number) => {
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));

  if (!blog) {
    throw new Error("بلاگ پیدا نشد");
  }

  return blog;
};

export const updateBlog = async (data: z.infer<typeof BlogUpdateSchema>) => {
  return db.transaction(async (tx) => {
    const current = await tx
      .select({ imgPath: blogs.imgPath })
      .from(blogs)
      .where(eq(blogs.id, data.id));

    if (!current[0]) {
      throw new Error("بلاگ پیدا نشد");
    }

    let filePath = current[0].imgPath;

    if (data.image) {
      if (filePath) {
        await deleteFile(filePath).catch(console.error);
      }

      const uploadResult = await saveUploadedFile(data.image);
      filePath = uploadResult.filePath;
    }

    const [blog] = await tx
      .update(blogs)
      .set({
        title: data.title,
        content: data.content,
        status: data.status,
        ...(filePath && { imgPath: filePath }),
      })
      .where(eq(blogs.id, data.id))
      .returning();

    return blog;
  });
};

export const deleteBlog = async (id: number) => {
  return db.transaction(async (tx) => {
    const [blog] = await tx
      .select({ imgPath: blogs.imgPath })
      .from(blogs)
      .where(eq(blogs.id, id));

    if (!blog) {
      throw new Error("بلاگ پیدا نشد");
    }

    if (blog.imgPath) {
      await deleteFile(blog.imgPath).catch(console.error);
    }

    await tx.delete(blogs).where(eq(blogs.id, id));
  });
};

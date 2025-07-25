import { db } from "@/db/db";
import { articles } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { saveUploadedFile, deleteFile } from "@/lib/file-utils";
import { z } from "zod";
import { ArticleCreateSchema, ArticleUpdateSchema } from "@/lib/api-validators";

export const createArticle = async (
  data: z.infer<typeof ArticleCreateSchema>,
) => {
  const { filePath } = await saveUploadedFile(data.file);

  const [article] = await db
    .insert(articles)
    .values({
      title: data.title,
      summary: data.summary,
      publishedAt: new Date(data.publishedAt),
      fileUrl: filePath,
    })
    .returning();

  return article;
};

export const getArticles = async (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      summary: articles.summary,
      fileUrl: articles.fileUrl,
      publishedAt: articles.publishedAt,
      total: sql<number>`count(*) OVER()`.as("total"),
    })
    .from(articles)
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);

  return {
    articles: result,
    totalPages: Math.ceil((result[0]?.total ?? 0) / limit),
  };
};

export const updateArticle = async (
  data: z.infer<typeof ArticleUpdateSchema>,
) => {
  const current = await db
    .select({ fileUrl: articles.fileUrl })
    .from(articles)
    .where(eq(articles.id, data.id));

  if (!current[0]) throw new Error("مقاله پیدا نشد");

  let fileUrl = current[0].fileUrl;

  if (data.file instanceof File && data.file.size > 0) {
    if (fileUrl) await deleteFile(fileUrl).catch(console.error);
    const uploadResult = await saveUploadedFile(data.file);
    fileUrl = uploadResult.filePath;
  }

  const [article] = await db
    .update(articles)
    .set({
      title: data.title,
      summary: data.summary,
      ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
      fileUrl,
    })
    .where(eq(articles.id, data.id))
    .returning();

  return article;
};

export const deleteArticle = async (id: number) => {
  const [article] = await db
    .select({ fileUrl: articles.fileUrl })
    .from(articles)
    .where(eq(articles.id, id));

  if (!article) throw new Error("مقاله پیدا نشد");

  if (article.fileUrl) {
    await deleteFile(article.fileUrl).catch(console.error);
  }

  await db.delete(articles).where(eq(articles.id, id));
};

import { db } from "@/db/db";
import { articles } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { deleteFile } from "@/lib/file-utils";
import { ArticleFormData } from "@/lib/validation-schema";

export const createArticle = async (data: ArticleFormData) => {
  const [article] = await db
    .insert(articles)
    .values({
      ...data,
      publishedAt: new Date(),
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
      fileKey: articles.fileKey,
      scholarLink: articles.scholarLink,
      inputType: articles.inputType,
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

export const updateArticle = async (id: number, data: ArticleFormData) => {
  const current = await db.select().from(articles).where(eq(articles.id, id));

  if (!current[0]) throw new Error("مقاله پیدا نشد");

  const [article] = await db
    .update(articles)
    .set({
      ...data,
    })
    .where(eq(articles.id, id))
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

import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  imageKey: varchar("image_key", { length: 255 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  fileUrl: varchar("file_url", { length: 500 }),
  fileKey: varchar("file_key", { length: 255 }),
});

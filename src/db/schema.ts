import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  integer,
} from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  imgPath: text("img_path").notNull(),
  mimeType: varchar("mime_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  fileUrl: text("file_url").notNull(),
});

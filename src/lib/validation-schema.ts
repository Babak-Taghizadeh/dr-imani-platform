import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

export const modifyBlogSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  cover: z.any().optional(),
  content: z.string().min(10, "Content is too short"),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
});

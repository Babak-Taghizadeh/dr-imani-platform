import { z } from "zod";

export const BlogCreateSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "آپلود تصویر الزامی است"),
});

export const BlogUpdateSchema = BlogCreateSchema.partial().extend({
  id: z.number().int().positive(),
  image: z.instanceof(File).optional(),
});

export const ArticleCreateSchema = z.object({
  title: z
    .string({ required_error: "عنوان مقاله الزامی است" })
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(255, "عنوان نباید بیش از ۲۵۵ کاراکتر باشد"),

  summary: z
    .string({ required_error: "خلاصه مقاله الزامی است" })
    .min(10, "خلاصه باید حداقل ۱۰ کاراکتر باشد"),

  publishedAt: z
    .string({ required_error: "تاریخ انتشار الزامی است" })
    .datetime("تاریخ انتشار معتبر نیست"),

  file: z
    .instanceof(File, { message: "فایل انتخاب نشده است" })
    .refine((file) => file.size > 0, { message: "آپلود فایل الزامی است" }),
});

export const ArticleUpdateSchema = ArticleCreateSchema.omit({
  file: true,
}).extend({
  id: z.number().int().positive(),
  file: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size > 0, "فایل نباید خالی باشد"),
      z.undefined(),
    ])
    .optional(),
});

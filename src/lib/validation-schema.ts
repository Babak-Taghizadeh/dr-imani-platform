import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

export const modifyBlogSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  content: z.string().min(1, "محتوا الزامی است"),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
  image: z
    .instanceof(File, {
      message: "فایل انتخاب شده معتبر نیست",
    })
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "حجم تصویر باید کمتر از ۵ مگابایت باشد",
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "فقط فرمت‌های JPEG, PNG و WebP پشتیبانی می‌شوند",
    )
    .optional(),
});

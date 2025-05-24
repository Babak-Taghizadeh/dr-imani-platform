import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

export const modifyBlogSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  content: z.string().min(1, "محتوا الزامی است"),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
  image: z.custom<File>((file) => file instanceof File, {
    message: "تصویر الزامی است",
  }),
});

import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

export const articleFormSchema = z.object({
  title: z
    .string({ required_error: "عنوان مقاله الزامی است" })
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(255, "عنوان نباید بیش از ۲۵۵ کاراکتر باشد"),
  summary: z
    .string({ required_error: "خلاصه مقاله الزامی است" })
    .min(10, "خلاصه باید حداقل ۱۰ کاراکتر باشد"),
  fileUrl: z.string().optional(),
  fileKey: z.string().optional(),
});

// NEW LOGIC
export const blogFormSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است")
    .max(255, "عنوان نباید بیشتر از 255 کاراکتر باشد")
    .trim(),
  content: z
    .string()
    .min(1, "محتوا الزامی است")
    .min(10, "محتوای بلاگ باید حداقل ۱۰ کاراکتر باشد")
    .trim(),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
// END OF NEW LOGIC
export type LoginFormValues = z.infer<typeof loginSchema>;

export type ArticleFormData = z.infer<typeof articleFormSchema>;

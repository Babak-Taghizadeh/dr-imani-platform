import * as z from "zod";

// Common reusable schemas
const fileSchema = z
  .instanceof(File, { message: "فایل انتخاب شده معتبر نیست" })
  .refine((file) => file.size > 0, "فایل نباید خالی باشد");

const imageSchema = fileSchema
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "حجم تصویر باید کمتر از ۵ مگابایت باشد",
  )
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "فقط فرمت‌های JPEG, PNG و WebP پشتیبانی می‌شوند",
  );

const documentSchema = fileSchema.refine(
  (file) => [".pdf", ".docx"].some((ext) => file.name.endsWith(ext)),
  "فقط فرمت‌های PDF و DOCX پشتیبانی می‌شوند",
);

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

const blogBaseSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد").max(255),
  content: z.string().min(10, "محتوا باید حداقل ۱۰ کاراکتر باشد"),
  status: z.enum(["منتشر شده", "ذخیره شده"]),
});

export const BlogCreateSchema = blogBaseSchema.extend({
  image: imageSchema.refine((file) => !!file, "تصویر کاور الزامی است"),
});

export const BlogUpdateSchema = blogBaseSchema.extend({
  image: imageSchema.optional(),
});

export const createModifyBlogSchema = (isEditing: boolean) => {
  const baseSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    content: z.string().min(1, "محتوا الزامی است"),
    status: z.enum(["منتشر شده", "ذخیره شده"]),
  });

  const imageSchema = z
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
    );

  const schema = isEditing
    ? baseSchema.extend({
        image: imageSchema.optional(),
      })
    : baseSchema.extend({
        image: imageSchema.refine((file) => !!file, {
          message: "تصویر کاور الزامی است",
        }),
      });

  return {
    schema,
    type: {} as z.infer<typeof schema>,
  };
};

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
  file: documentSchema,
});

export const ArticleUpdateSchema = ArticleCreateSchema.extend({
  id: z.number().int().positive(),
  file: documentSchema.optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type BlogFormValues = z.infer<typeof BlogCreateSchema>;
export type BlogUpdateValues = z.infer<typeof BlogUpdateSchema>;
export type ArticleFormValues = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdateValues = z.infer<typeof ArticleUpdateSchema>;
export type ModifyBlogFormValues = ReturnType<
  typeof createModifyBlogSchema
>["type"];

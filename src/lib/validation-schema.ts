import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "فیلد اجباری"),
  password: z.string().min(1, "فیلد اجباری"),
});

export const articleFormSchema = z
  .object({
    title: z
      .string({ required_error: "عنوان مقاله الزامی است" })
      .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
      .max(255, "عنوان نباید بیش از ۲۵۵ کاراکتر باشد"),
    summary: z
      .string({ required_error: "خلاصه مقاله الزامی است" })
      .min(10, "خلاصه باید حداقل ۱۰ کاراکتر باشد"),
    fileUrl: z.string().optional(),
    fileKey: z.string().optional(),
    scholarLink: z.string().optional(),
    inputType: z.enum(["file", "link"]),
  })
  .refine(
    (data) => {
      // Either fileUrl or scholarLink must be provided
      if (data.inputType === "file") {
        return data.fileUrl && data.fileUrl.length > 0;
      } else {
        return data.scholarLink && data.scholarLink.length > 0;
      }
    },
    {
      message: "لطفاً یک فایل آپلود کنید یا لینک گوگل اسکالر را وارد کنید",
      path: ["fileUrl"],
    },
  );

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

// Booking schemas
export const signupSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  idNumber: z.string().min(1, "کد ملی الزامی است"),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const userLoginSchema = z.object({
  phoneNumber: z.string().min(1, "شماره تلفن الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "نام الزامی است").optional(),
  idNumber: z.string().min(1, "کد ملی الزامی است").optional(),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست").optional(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").optional(),
});

export const bookingSchema = z.object({
  appointmentType: z.enum(["ONLINE_PHONE", "IN_CLINIC"]),
  ageRange: z.enum(["UNDER_15", "OVER_15"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "فرمت زمان نامعتبر است"),
});

export const forgotPasswordSchema = z.object({
  idNumber: z.string().min(1, "کد ملی الزامی است"),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(6, "تأیید رمز عبور الزامی است"),
    token: z.string().min(1, "توکن معتبر نیست"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تأیید رمز عبور باید یکسان باشند",
    path: ["confirmPassword"],
  });

export const disableDatesSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ نامعتبر است"),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "تاریخ شروع باید قبل از تاریخ پایان باشد",
      path: ["endDate"],
    },
  );

export type SignupFormData = z.infer<typeof signupSchema>;
export type UserLoginFormData = z.infer<typeof userLoginSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type DisableDatesFormData = z.infer<typeof disableDatesSchema>;

"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { userLoginSchema, UserLoginFormData } from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: UserLoginFormData) => {
    const res = await signIn("user", {
      phoneNumber: values.phoneNumber,
      password: values.password,
      callbackUrl: "/profile",
      redirect: false,
    });

    if (res?.status === 401) {
      toast.error("شماره تلفن یا رمز عبور اشتباه است", {
        description: "لطفا دوباره امتحان کنید",
      });
    } else if (res?.ok) {
      toast.success("خوش آمدید");
      router.replace("/profile");
    } else {
      toast.error("خطایی در ورود رخ داد");
    }
  };

  return (
    <AuthLayout
      title="ورود"
      description="برای رزرو نوبت، وارد حساب کاربری خود شوید"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormControl>
                <AuthInput
                  {...field}
                  label="شماره تلفن"
                  type="tel"
                  autocomplete="tel"
                  error={form.formState.errors.phoneNumber?.message}
                  placeholder="09123456789"
                />
              </FormControl>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormControl>
                <AuthInput
                  {...field}
                  label="رمز عبور"
                  type="password"
                  autocomplete="current-password"
                  showPasswordToggle
                  error={form.formState.errors.password?.message}
                />
              </FormControl>
            )}
          />

          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-accent-foreground hover:text-foreground text-sm transition-colors hover:underline"
            >
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>

          <AuthSubmitButton isLoading={form.formState.isSubmitting}>
            ورود
          </AuthSubmitButton>

          <p className="text-muted-foreground text-center text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium hover:underline"
            >
              ثبت‌نام
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}

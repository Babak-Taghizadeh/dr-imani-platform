"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthInput } from "@/components/sections/auth/auth-input";
import { AuthSubmitButton } from "@/components/sections/auth/auth-submit-button";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { PasswordRequirements } from "@/components/sections/auth/password-requirements";
import { signupSchema, SignupFormData } from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      phoneNumber: "",
      password: "",
    },
  });

  const password = form.watch("password");

  const onSubmit = async (values: SignupFormData) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطایی در ثبت‌نام رخ داد");
        return;
      }

      toast.success("ثبت‌نام با موفقیت انجام شد");

      // Auto login after signup
      const loginRes = await signIn("user", {
        phoneNumber: values.phoneNumber,
        password: values.password,
        callbackUrl: "/profile",
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/profile");
      } else {
        router.push("/login");
      }
    } catch {
      toast.error("خطایی در ثبت‌نام رخ داد");
    }
  };

  return (
    <AuthLayout
      title="ثبت‌نام"
      description="برای رزرو نوبت، ابتدا ثبت‌نام کنید"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormControl>
                <AuthInput
                  {...field}
                  label="نام و نام خانوادگی"
                  type="text"
                  autocomplete="name"
                  error={form.formState.errors.name?.message}
                  placeholder="نام خود را وارد کنید"
                />
              </FormControl>
            )}
          />

          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormControl>
                <AuthInput
                  {...field}
                  label="کد ملی"
                  type="text"
                  autocomplete="off"
                  error={form.formState.errors.idNumber?.message}
                  placeholder="کد ملی"
                />
              </FormControl>
            )}
          />

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
                <div className="space-y-2">
                  <AuthInput
                    {...field}
                    label="رمز عبور"
                    type="password"
                    autocomplete="new-password"
                    showPasswordToggle
                    error={form.formState.errors.password?.message}
                  />
                  <PasswordRequirements password={password} />
                </div>
              </FormControl>
            )}
          />

          <AuthSubmitButton isLoading={form.formState.isSubmitting}>
            ثبت‌نام
          </AuthSubmitButton>

          <p className="text-muted-foreground text-center text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-foreground font-medium hover:underline"
            >
              ورود
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}

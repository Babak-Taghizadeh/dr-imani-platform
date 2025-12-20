"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      idNumber: "",
      phoneNumber: "",
    },
  });

  // Autofocus first field
  useEffect(() => {
    const firstInput = document.querySelector<HTMLInputElement>(
      'input[name="idNumber"]',
    );
    firstInput?.focus();
  }, []);

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطایی در بازیابی رمز عبور رخ داد");
        return;
      }

      toast.success("اطلاعات شما تأیید شد");
      router.push(`/reset-password?token=${encodeURIComponent(data.token)}`);
    } catch {
      toast.error("خطایی در بازیابی رمز عبور رخ داد");
    }
  };

  return (
    <AuthLayout
      title="بازیابی رمز عبور"
      description="کد ملی و شماره تلفن خود را وارد کنید. پس از تأیید، می‌توانید رمز عبور جدید خود را تنظیم کنید."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

          <AuthSubmitButton isLoading={form.formState.isSubmitting}>
            درخواست بازیابی
          </AuthSubmitButton>

          <div className="text-center">
            <Link
              href="/login"
              className="text-accent-foreground hover:text-foreground text-sm underline transition-colors"
            >
              بازگشت به صفحه ورود
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}

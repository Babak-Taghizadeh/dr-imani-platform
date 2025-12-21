"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (values: ResetPasswordFormData) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: values.token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطایی در تغییر رمز عبور رخ داد");
        return;
      }

      toast.success("رمز عبور با موفقیت تغییر کرد");
      router.push("/login");
    } catch {
      toast.error("خطایی در تغییر رمز عبور رخ داد");
    }
  };

  return (
    <AuthLayout
      title="تنظیم رمز عبور جدید"
      description="رمز عبور جدید خود را وارد کنید"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormControl>
                <div className="space-y-2">
                  <AuthInput
                    {...field}
                    label="رمز عبور جدید"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl>
                <AuthInput
                  {...field}
                  label="تأیید رمز عبور"
                  type="password"
                  autocomplete="new-password"
                  showPasswordToggle
                  error={form.formState.errors.confirmPassword?.message}
                />
              </FormControl>
            )}
          />

          <FormField control={form.control} name="token" render={() => <></>} />

          <AuthSubmitButton isLoading={form.formState.isSubmitting}>
            تنظیم رمز عبور جدید
          </AuthSubmitButton>

          <div className="text-center">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              بازگشت به صفحه ورود
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}

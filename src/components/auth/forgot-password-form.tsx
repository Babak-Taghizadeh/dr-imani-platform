"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      idNumber: "",
      phoneNumber: "",
    },
  });

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>بازیابی رمز عبور</CardTitle>
          <CardDescription>
            شماره شناسنامه و شماره تلفن خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره شناسنامه</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="شماره شناسنامه" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تلفن</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="09123456789" type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                ادامه
              </Button>
              <Link
                href="/login"
                className="text-primary text-center text-sm hover:underline"
              >
                بازگشت به صفحه ورود
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

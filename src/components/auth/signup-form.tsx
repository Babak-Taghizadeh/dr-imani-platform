"use client";

import { signIn } from "next-auth/react";
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
import { signupSchema, SignupFormData } from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ثبت‌نام</CardTitle>
          <CardDescription>برای رزرو نوبت، ابتدا ثبت‌نام کنید</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="نام خود را وارد کنید" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="absolute top-1/2 left-0 -translate-y-1/6">
                      <button
                        type="button"
                        className="rounded-md p-2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
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
                ثبت‌نام
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link href="/login" className="text-primary hover:underline">
                  ورود
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

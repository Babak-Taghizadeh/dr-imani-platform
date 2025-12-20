"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/lib/validation-schema";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect } from "react";
import type { User } from "@/lib/types";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      idNumber: user.idNumber,
      phoneNumber: user.phoneNumber,
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    form.reset({
      name: user.name,
      idNumber: user.idNumber,
      phoneNumber: user.phoneNumber,
    });
  }, [user, form]);

  const onSubmit = async (values: UpdateProfileFormData) => {
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در به‌روزرسانی پروفایل");
        return;
      }

      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      toast.error("خطایی در به‌روزرسانی پروفایل رخ داد");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>پروفایل کاربری</CardTitle>
          <CardDescription>اطلاعات شخصی خود را مدیریت کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>کد ملی</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور جدید (اختیاری)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="در صورت تغییر رمز عبور وارد کنید"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  ذخیره تغییرات
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile/appointments">مشاهده نوبت‌ها</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/booking">رزرو نوبت جدید</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

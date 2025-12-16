"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  disableDatesSchema,
  DisableDatesFormData,
} from "@/lib/validation-schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DisableDatesForm() {
  const router = useRouter();

  const form = useForm<DisableDatesFormData>({
    resolver: zodResolver(disableDatesSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const onSubmit = async (values: DisableDatesFormData) => {
    try {
      const res = await fetch("/api/admin/disable-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("بازه تاریخ با موفقیت غیرفعال شد");
        if (data.warning) {
          toast.warning(data.warning);
        }
        form.reset();
        router.refresh();
      } else {
        toast.error(data.error || "خطا در غیرفعال کردن تاریخ");
      }
    } catch (error) {
      console.error("Error submitting disabled dates:", error);
      toast.error("خطایی در غیرفعال کردن تاریخ رخ داد");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>غیرفعال کردن تاریخ</CardTitle>
        <CardDescription>
          بازه‌های تاریخی را برای رزرو غیرفعال کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ شروع</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ پایان</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دلیل (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="دلیل غیرفعال کردن این بازه"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              غیرفعال کردن
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

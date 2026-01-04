"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { JalaliDateInput } from "@/components/ui/jalali-date-input";
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

interface DisabledDateRange {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

interface DisableDatesFormProps {
  disabledDate?: DisabledDateRange;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  hideCard?: boolean;
}

export function DisableDatesForm({
  disabledDate,
  mode = "create",
  onSuccess,
  hideCard = false,
}: DisableDatesFormProps) {
  const router = useRouter();

  const form = useForm<DisableDatesFormData>({
    resolver: zodResolver(disableDatesSchema),
    defaultValues: {
      startDate: disabledDate?.startDate || "",
      endDate: disabledDate?.endDate || "",
      reason: disabledDate?.reason || "",
    },
  });

  // Update form values when disabledDate changes
  useEffect(() => {
    if (disabledDate) {
      form.reset({
        startDate: disabledDate.startDate,
        endDate: disabledDate.endDate,
        reason: disabledDate.reason || "",
      });
    }
  }, [disabledDate, form]);

  const onSubmit = async (values: DisableDatesFormData) => {
    try {
      const url =
        mode === "edit" && disabledDate
          ? `/api/admin/disable-dates/${disabledDate.id}`
          : "/api/admin/disable-dates";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          mode === "edit"
            ? "بازه تاریخ با موفقیت به‌روزرسانی شد"
            : "بازه تاریخ با موفقیت غیرفعال شد",
        );
        if (data.warning) {
          toast.warning(data.warning);
        }
        form.reset();
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(
          data.error ||
            (mode === "edit"
              ? "خطا در به‌روزرسانی تاریخ"
              : "خطا در غیرفعال کردن تاریخ"),
        );
      }
    } catch (error) {
      console.error("Error submitting disabled dates:", error);
      toast.error(
        mode === "edit"
          ? "خطایی در به‌روزرسانی تاریخ رخ داد"
          : "خطایی در غیرفعال کردن تاریخ رخ داد",
      );
    }
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاریخ شروع</FormLabel>
              <FormControl>
                <JalaliDateInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ شروع را انتخاب کنید"
                />
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
                <JalaliDateInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ پایان را انتخاب کنید"
                />
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
              <FormLabel>توضیحات (اختیاری)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="توضیحات غیرفعال کردن این بازه"
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
          {mode === "edit" ? "به‌روزرسانی" : "غیرفعال کردن"}
        </Button>
      </form>
    </Form>
  );

  if (hideCard) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "ویرایش بازه تاریخ" : "غیرفعال کردن تاریخ"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "بازه تاریخی را ویرایش کنید"
            : "بازه‌های تاریخی را برای رزرو غیرفعال کنید"}
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}

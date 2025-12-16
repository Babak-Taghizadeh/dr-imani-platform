"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  appointmentsFilterSchema,
  AppointmentsFilterFormData,
} from "@/lib/validation-schema";

interface AppointmentsFilterFormProps {
  onFilterChange: (filters: AppointmentsFilterFormData) => void;
  onReset: () => void;
}

export function AppointmentsFilterForm({
  onFilterChange,
  onReset,
}: AppointmentsFilterFormProps) {
  const form = useForm<AppointmentsFilterFormData>({
    resolver: zodResolver(appointmentsFilterSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      status: "",
      appointmentType: "",
      sortOrder: "desc",
    },
  });

  // Watch form values and call onFilterChange when they change
  const watchedValues = form.watch();
  const previousValuesRef = useRef<string>("");

  useEffect(() => {
    const currentValues = JSON.stringify(watchedValues);
    if (currentValues !== previousValuesRef.current) {
      previousValuesRef.current = currentValues;
      onFilterChange(watchedValues);
    }
  }, [watchedValues, onFilterChange]);

  const handleReset = () => {
    form.reset({
      fromDate: "",
      toDate: "",
      status: "",
      appointmentType: "",
      sortOrder: "desc",
    });
    onReset();
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>از تاریخ</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تا تاریخ</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وضعیت</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={(value) => {
                  field.onChange(value === "all" ? "" : value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="PENDING">در انتظار پرداخت</SelectItem>
                  <SelectItem value="CONFIRMED">تأیید شده</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="appointmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع نوبت</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={(value) => {
                  field.onChange(value === "all" ? "" : value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="ONLINE_PHONE">تماس تلفنی</SelectItem>
                  <SelectItem value="IN_CLINIC">حضوری</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مرتب‌سازی</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="desc">تاریخ ایجاد (جدیدترین)</SelectItem>
                  <SelectItem value="asc">تاریخ ایجاد (قدیمی‌ترین)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button variant="outline" onClick={handleReset} type="button">
            پاک کردن فیلترها
          </Button>
        </div>
      </div>
    </Form>
  );
}

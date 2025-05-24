"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { modifyBlogSchema } from "@/lib/validation-schema";
import { z } from "zod";
import { Blog } from "@/lib/types";

interface ModifyBlogModalProps {
  onSave: (formData: FormData) => void;
  blog?: Blog;
}

const ModifyBlogModal = ({ onSave, blog }: ModifyBlogModalProps) => {
  const form = useForm<z.infer<typeof modifyBlogSchema>>({
    resolver: zodResolver(modifyBlogSchema),
    defaultValues: {
      title: blog?.title,
      content: blog?.content,
      status: blog?.status,
    },
  });

  const onSubmit = (values: z.infer<typeof modifyBlogSchema>) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("status", values.status);

    if (values.image) {
      formData.append("image", values.image);
    }

    onSave(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{blog ? "ویرایش" : "افزودن بلاگ"}</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {blog ? "ویرایش بلاگ" : "افزودن بلاگ"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان بلاگ را وارد کنید" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عکس کاور</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="bg-muted border-input hover:bg-accent inline-flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium"
                      >
                        انتخاب فایل
                      </label>
                      {field.value && (
                        <p className="text-muted-foreground mt-2 text-sm">
                          فایل انتخاب شده: {field.value.name}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محتوا</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="محتوای بلاگ را اینجا بنویسید ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وضعیت انتشار</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="وضعیت بلاگ را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="منتشر شده">منتشر شده</SelectItem>
                        <SelectItem value="ذخیره شده">ذخیره شده</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  انصراف
                </Button>
              </DialogClose>
              <Button type="submit">ذخیره</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyBlogModal;

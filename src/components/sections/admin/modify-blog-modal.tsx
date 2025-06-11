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
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ModifyBlogModalProps {
  onSave: (formData: FormData) => void;
  blog?: Blog;
}

const ModifyBlogModal = ({ onSave, blog }: ModifyBlogModalProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof modifyBlogSchema>>({
    resolver: zodResolver(modifyBlogSchema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      status: blog?.status || "ذخیره شده",
    },
  });

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (file: File | null) => {
    // Cleanup previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    form.setValue("image", undefined);
  };

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
                    <div className="space-y-4">
                      {/* Existing Image Display */}
                      {blog?.img && !previewUrl && (
                        <div className="relative">
                          <div className="relative h-48 w-full overflow-hidden rounded-md border">
                            <Image
                              src={blog.img}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-muted-foreground mt-2 text-sm">
                            تصویر فعلی بلاگ
                          </p>
                        </div>
                      )}

                      {/* New Image Preview */}
                      {previewUrl && (
                        <div className="relative">
                          <div className="relative h-48 w-full overflow-hidden rounded-md border">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground mt-2 text-sm">
                            تصویر جدید انتخاب شده
                          </p>
                        </div>
                      )}

                      {/* Image Upload */}
                      <div className="flex items-center gap-4">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              handleImageChange(file);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-muted border-input hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          {blog ? "تغییر تصویر" : "انتخاب تصویر"}
                        </label>

                        {blog && !selectedImage && (
                          <span className="text-muted-foreground text-sm">
                            تصویر فعلی حفظ خواهد شد
                          </span>
                        )}
                      </div>

                      {/* File Info */}
                      {selectedImage && (
                        <div className="bg-muted rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {selectedImage.name}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            حجم: {(selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
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

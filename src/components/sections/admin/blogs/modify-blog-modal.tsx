"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { modifyBlogSchema } from "@/lib/validation-schema";
import { z } from "zod";
import { Blog } from "@/lib/types";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogFormFields } from "./blog-form-fields";
import ImageUploadField from "./image-upload-field";

interface ModifyBlogModalProps {
  onSave: (formData: FormData) => void;
  blog?: Blog;
}

export const ModifyBlogModal = ({ onSave, blog }: ModifyBlogModalProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof modifyBlogSchema>>({
    resolver: zodResolver(modifyBlogSchema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      status: blog?.status || "ذخیره شده",
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    form.setValue("image", file);
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (values: z.infer<typeof modifyBlogSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("status", values.status);

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      onSave(formData);
    } catch (error) {
      toast.error("خطا در ذخیره بلاگ", {
        description:
          error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{blog ? "ویرایش" : "افزودن بلاگ"}</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {blog ? "ویرایش بلاگ" : "افزودن بلاگ"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BlogFormFields control={form.control} />

            <ImageUploadField
              blogImg={blog?.img.toString()}
              previewUrl={previewUrl}
              selectedImage={selectedImage}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              isEditing={!!blog}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  انصراف
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

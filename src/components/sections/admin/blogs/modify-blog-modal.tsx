"use client";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { modifyBlogSchema } from "@/lib/validation-schema";
import { z } from "zod";
import { Blog } from "@/lib/types";
import { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogFormFields } from "./blog-form-fields";
import ImageUploadField from "./image-upload-field";
import { DialogModalWrapper } from "@/components/shared/modal-wrapper";

interface ModifyBlogModalProps {
  onSave: (formData: FormData) => void;
  blog?: Blog;
}

export const ModifyBlogModal = ({ onSave, blog }: ModifyBlogModalProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("status", values.status);

        if (values.image instanceof File) {
          formData.append("image", values.image);
        }

        await onSave(formData);

        form.reset();
        setSelectedImage(null);
        setPreviewUrl(null);
        setOpen(false);
      } catch (error) {
        toast.error("خطا در ذخیره بلاگ", {
          description:
            error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید",
        });
      }
    });
  };

  return (
    <DialogModalWrapper
      isModalOpen={open}
      setModalOpen={setOpen}
      triggerLabel={blog ? "ویرایش" : "افزودن بلاگ"}
      title={blog ? "ویرایش بلاگ" : "افزودن بلاگ"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BlogFormFields control={form.control} />

          <ImageUploadField
            blogImg={blog?.imgPath.toString()}
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
            <Button
              type="submit"
              disabled={isPending || form.formState.isSubmitting}
            >
              {(isPending || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              ذخیره
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogModalWrapper>
  );
};

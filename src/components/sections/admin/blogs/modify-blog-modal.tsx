"use client";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createModifyBlogSchema,
  ModifyBlogFormValues,
} from "@/lib/validation-schema";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isEditing = !!blog;
  const { schema } = createModifyBlogSchema(isEditing);

  const form = useForm<ModifyBlogFormValues>({
    resolver: zodResolver(schema),
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
    setPreviewUrl(URL.createObjectURL(file));
    form.setValue("image", file);
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (values: ModifyBlogFormValues) => {
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
            control={form.control}
            blogImg={blog?.imgPath.toString()}
            previewUrl={previewUrl}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => form.reset()}
                variant="outline"
                type="button"
              >
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

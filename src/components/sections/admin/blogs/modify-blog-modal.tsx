"use client";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogFormData, blogFormSchema } from "@/lib/validation-schema";
import { Blog } from "@/lib/types";
import { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogFormFields } from "./blog-form-fields";
import { DialogModalWrapper } from "@/components/shared/modal-wrapper";
import { useRouter } from "next/navigation";
import ImageUploadField from "./image-upload-field";
import { useFileUpload } from "@/hooks/use-file-upload";

interface ModifyBlogModalProps {
  mode: "create" | "edit";
  blog?: Blog;
}

export const ModifyBlogModal = ({ mode, blog }: ModifyBlogModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      excerpt: blog?.excerpt || "",
      slug: blog?.slug || "",
      imageUrl: blog?.imageUrl || "",
      imageKey: blog?.imageKey || "",
      status: blog?.status || "ذخیره شده",
    },
    mode: "onChange",
  });

  const { file, reset, setSelectedFile, uploadSelectedFile, isUploading } =
    useFileUpload();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setError("imageUrl", {
        message: "سایز تصویر باید کمتر از 5 مگابایت باشد",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("imageUrl", {
        message: "لطفا یک تصویر معتبر انتخاب کنید",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);
    setSelectedFile(file);
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemoveImage = async () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    form.setValue("imageUrl", "");
    form.setValue("imageKey", "");
    setSelectedFile(null);
  };

  const onSubmit = async (data: BlogFormData) => {
    startTransition(async () => {
      try {
        let uploadedUrl = data.imageUrl;
        let uploadedKey = data.imageKey;

        if (file) {
          const { url, key } = await uploadSelectedFile(blog?.imageUrl);
          uploadedUrl = url!;
          uploadedKey = key!;
        }

        if (!uploadedUrl) {
          toast.error("لطفا یک تصویر برای بلاگ انتخاب کنید");
          return;
        }

        const payload = {
          ...data,
          imageUrl: uploadedUrl,
          imageKey: uploadedKey,
        };

        const url =
          mode === "create" ? "/api/blogs" : `/api/blogs/${blog?.slug}`;
        const method = mode === "create" ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error || "خطا در ذخیره بلاگ");
          return;
        }

        toast.success("بلاگ با موفقیت ذخیره شد.");
        form.reset();
        reset();
        router.refresh();
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("خطا در ذخیره بلاگ");
      }
    });
  };

  return (
    <DialogModalWrapper
      isModalOpen={open}
      setModalOpen={setOpen}
      triggerLabel={mode === "edit" ? "ویرایش بلاگ" : "افزودن بلاگ"}
      title={mode === "edit" ? "ویرایش بلاگ" : "افزودن بلاگ"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BlogFormFields control={form.control} />
          <ImageUploadField
            blogImg={blog?.imageUrl}
            onRemoveImage={handleRemoveImage}
            isUploading={isUploading}
            previewUrl={previewUrl}
            onImageChange={handleImageUpload}
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

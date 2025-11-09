"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Article } from "@/lib/types";
import { FileIcon, Loader2, Upload, X, Link, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { DialogModalWrapper } from "@/components/shared/modal-wrapper";
import { ArticleFormData, articleFormSchema } from "@/lib/validation-schema";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModifyArticleModalProps {
  mode: "create" | "edit";
  article?: Article;
}

export const ModifyArticleModal = ({
  mode,
  article,
}: ModifyArticleModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentFile, setCurrentFile] = useState<string | null>(
    article?.fileUrl || null,
  );

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || "",
      summary: article?.summary || "",
      fileUrl: article?.fileUrl || "",
      fileKey: article?.fileKey || "",
      scholarLink: article?.scholarLink || "",
      inputType: article?.inputType || "file",
    },
    mode: "onChange",
  });

  const { file, reset, setSelectedFile, uploadSelectedFile, isUploading } =
    useFileUpload();

  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        form.setError("fileUrl", {
          message: "سایز فایل باید کمتر از 10 مگابایت باشد",
        });
        return;
      }

      setCurrentFile(file.name);
      setSelectedFile(file);
    }
  };

  const handleRemovePdf = async () => {
    if (currentFile) {
      URL.revokeObjectURL(currentFile);
      setCurrentFile(null);
    }
    form.setValue("fileUrl", "");
    form.setValue("fileKey", "");
    setSelectedFile(null);
  };

  const onSubmit = async (data: ArticleFormData) => {
    startTransition(async () => {
      try {
        let uploadedUrl = data.fileUrl;
        let uploadedKey = data.fileKey;

        // Handle file upload if input type is file
        if (data.inputType === "file") {
          if (file) {
            const { url, key } = await uploadSelectedFile(article?.fileUrl);
            uploadedUrl = url!;
            uploadedKey = key!;
          }

          if (!uploadedUrl) {
            toast.error("لطفا یک فایل PDF برای مقاله انتخاب کنید");
            return;
          }
        }

        // Handle Google Scholar link if input type is link
        if (data.inputType === "link" && !data.scholarLink) {
          toast.error("لطفا لینک گوگل اسکالر را وارد کنید");
          return;
        }

        const payload = {
          ...data,
          fileUrl: data.inputType === "file" ? uploadedUrl : "",
          fileKey: data.inputType === "file" ? uploadedKey : "",
          scholarLink: data.inputType === "link" ? data.scholarLink : "",
        };

        const url =
          mode === "create" ? "/api/articles" : `/api/articles/${article?.id}`;

        const method = mode === "create" ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error("خطا در ذخیره مقاله", {
            description:
              error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید",
          });
        }

        toast.success("مقاله با موفقیت ذخیره شد.");
        form.reset();
        reset();
        router.refresh();
        setOpen(false);
      } catch (error) {
        toast.error("خطا در ذخیره مقاله.", {
          description:
            error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید.",
        });
      }
    });
  };

  return (
    <DialogModalWrapper
      triggerLabel={article ? "ویرایش مقاله" : "افزودن مقاله"}
      title={article ? "ویرایش مقاله" : "افزودن مقاله"}
      isModalOpen={open}
      setModalOpen={setOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid min-h-[500px] gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان مقاله" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>خلاصه</FormLabel>
                  <FormControl>
                    <Textarea placeholder="خلاصه مقاله" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="inputType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع ورودی</FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear the other field when switching
                          if (value === "file") {
                            form.setValue("scholarLink", "");
                          } else {
                            form.setValue("fileUrl", "");
                            form.setValue("fileKey", "");
                            setCurrentFile(null);
                            setSelectedFile(null);
                          }
                        }}
                        className="w-full"
                      >
                        <TabsList className="bg-muted/20 flex justify-center gap-6 rounded-lg p-4 py-6 shadow-md">
                          <TabsTrigger
                            value="file"
                            className="flex items-center gap-2 sm:p-4"
                          >
                            <FileIcon className="text-blue-600" />
                            آپلود فایل
                          </TabsTrigger>
                          <TabsTrigger
                            value="link"
                            className="flex items-center gap-2 sm:p-4"
                          >
                            <LinkIcon className="text-purple-600" />
                            لینک گوگل اسکالر
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="file"
                          className="mt-6 min-h-[270px] space-y-4"
                        >
                          {(currentFile || article?.fileUrl) && (
                            <div className="relative flex items-center justify-between rounded-lg border p-4">
                              <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-gray-500" />
                                <span className="text-sm font-medium">
                                  {(currentFile || article?.fileUrl)
                                    ?.split("/")
                                    .pop()}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={handleRemovePdf}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          <Label>فایل مقاله</Label>
                          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4">
                                <Label
                                  htmlFor="pdf-upload"
                                  className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                  {isUploading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      در حال آپلود ...
                                    </>
                                  ) : (
                                    "انتخاب فایل"
                                  )}
                                </Label>
                                <Input
                                  id="pdf-upload"
                                  type="file"
                                  accept=".pdf,.docx"
                                  onChange={handlePDFUpload}
                                  disabled={isUploading}
                                  className="mt-4"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                فرمت‌های مجاز: PDF, DOCX (حداکثر 10MB)
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="link"
                          className="mt-6 min-h-[270px] space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="scholarLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>لینک گوگل اسکالر</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://scholar.google.com/..."
                                    type="url"
                                    {...field}
                                    dir="ltr"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                              <Link className="mt-0.5 h-5 w-5 text-blue-600" />
                              <div className="text-sm text-blue-800">
                                <p className="font-medium">راهنمای استفاده:</p>
                                <p className="mt-1">
                                  لینک مقاله را از گوگل اسکالر کپی کرده و در
                                  فیلد بالا وارد کنید.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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

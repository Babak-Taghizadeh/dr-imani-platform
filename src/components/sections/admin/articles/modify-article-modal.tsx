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
import { Article } from "@/types/types";
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid min-h-[400px] gap-3 sm:min-h-[500px] sm:gap-4">
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
                        <TabsList className="bg-muted/20 flex w-full justify-center gap-2 rounded-lg p-2 shadow-md sm:gap-4 sm:p-3 md:gap-6 md:p-4 md:py-6">
                          <TabsTrigger
                            value="file"
                            className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm md:text-base"
                          >
                            <FileIcon className="h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" />
                            <span className="whitespace-nowrap">
                              آپلود فایل
                            </span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="link"
                            className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm md:text-base"
                          >
                            <LinkIcon className="h-4 w-4 shrink-0 text-purple-600 sm:h-5 sm:w-5" />
                            <span className="whitespace-nowrap">
                              لینک گوگل اسکالر
                            </span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="file"
                          className="mt-4 min-h-[200px] space-y-3 sm:mt-6 sm:min-h-[270px] sm:space-y-4"
                        >
                          {(currentFile || article?.fileUrl) && (
                            <div className="relative flex items-center justify-between rounded-lg border p-2 sm:p-3 md:p-4">
                              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                                <FileIcon className="h-4 w-4 shrink-0 text-gray-500 sm:h-5 sm:w-5" />
                                <span className="min-w-0 truncate text-xs font-medium sm:text-sm">
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
                          <div className="rounded-lg border-2 border-dashed border-gray-300 p-3 sm:p-4 md:p-6">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                              <div className="mt-3 sm:mt-4">
                                <Label
                                  htmlFor="pdf-upload"
                                  className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
                                >
                                  {isUploading ? (
                                    <>
                                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                      <span className="whitespace-nowrap">
                                        در حال آپلود ...
                                      </span>
                                    </>
                                  ) : (
                                    <span className="whitespace-nowrap">
                                      انتخاب فایل
                                    </span>
                                  )}
                                </Label>
                                <Input
                                  id="pdf-upload"
                                  type="file"
                                  accept=".pdf,.docx"
                                  onChange={handlePDFUpload}
                                  disabled={isUploading}
                                  className="mt-3 sm:mt-4"
                                />
                              </div>
                              <p className="mt-2 text-[10px] text-gray-500 sm:text-xs">
                                فرمت‌های مجاز: PDF, DOCX (حداکثر 10MB)
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="link"
                          className="mt-4 min-h-[200px] space-y-3 sm:mt-6 sm:min-h-[270px] sm:space-y-4"
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
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 sm:p-3 md:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Link className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" />
                              <div className="min-w-0 text-xs text-blue-800 sm:text-sm">
                                <p className="font-medium">راهنمای استفاده:</p>
                                <p className="mt-1 break-words">
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

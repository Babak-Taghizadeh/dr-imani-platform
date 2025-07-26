"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModifyArticleModal } from "./modify-article-modal";

const AddArticle = () => {
  const router = useRouter();

  const onSave = async (formData: FormData) => {
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره مقاله.");
      }

      toast.success("مقاله با موفقیت ذخیره شد.");
      router.refresh();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("خطا در ذخیره مقاله، دوباره تلاش کنید.");
    }
  };

  return <ModifyArticleModal onSave={onSave} />;
};

export default AddArticle;

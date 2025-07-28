"use client";
import { toast } from "sonner";
import { ModifyBlogModal } from "./modify-blog-modal";
import { useRouter } from "next/navigation";

const AddBlog = () => {
  const router = useRouter();

  const onSave = async (formData: FormData) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره بلاگ");
      }

      toast.success("بلاگ با موفقیت ذخیره شد.");
      router.refresh();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("خطا در ذخیره بلاگ، دوباره تلاش کنید.");
    }
  };
  return <ModifyBlogModal onSave={onSave} />;
};

export default AddBlog;

"use client";
import { toast } from "sonner";
import ModifyBlogModal from "./modify-blog-modal";

const AddBlog = () => {
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
      toast("بلاگ با موفقیت ذخیره شد");
      // Optionally refresh your blog list or update UI here
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("خطا در ذخیره بلاگ، دوباره تلاش کنید");
    }
  };
  return <ModifyBlogModal onSave={onSave} />;
};

export default AddBlog;

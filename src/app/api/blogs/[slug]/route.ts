import { errorResponse, successResponse } from "@/lib/api-utils";
import { BlogUpdateSchema } from "@/lib/validation-schema";
import {
  deleteBlogBySlug,
  getBlogBySlug,
  updateBlog,
} from "@/utils/blog-services";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  try {
    const slug = await params.slug;
    const blog = await getBlogBySlug(slug);
    return successResponse(blog);
  } catch (err) {
    console.error("Get blog error:", err);
    return errorResponse(err instanceof Error ? err.message : "بلاگ پیدا نشد", {
      status: 404,
    });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  try {
    const formData = await req.formData();
    const slug = await params.slug;

    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
      status: formData.get("status"),
      image: formData.get("image") || undefined,
    };

    const validated = BlogUpdateSchema.parse(data);
    const updated = await updateBlog(slug, validated);
    return successResponse(updated);
  } catch (err) {
    console.error("Update blog error:", err);
    return errorResponse(
      err instanceof Error ? err.message : "خطا در به‌روزرسانی بلاگ",
      {
        status: 400,
        details: err,
        devDetails: true,
      },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  try {
    await deleteBlogBySlug(params.slug);
    return successResponse({ success: true });
  } catch (err) {
    console.error("Delete blog error:", err);
    return errorResponse(
      err instanceof Error ? err.message : "خطا در حذف بلاگ",
      {
        status: 400,
      },
    );
  }
};

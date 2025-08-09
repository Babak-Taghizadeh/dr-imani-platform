import { errorResponse, successResponse } from "@/lib/api-utils";
import { blogFormSchema } from "@/lib/validation-schema";
import {
  deleteBlogBySlug,
  getBlogBySlug,
  updateBlog,
} from "@/utils/blog-services";
import { NextRequest } from "next/server";
import { z } from "zod";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const slug = (await params).slug;
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
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const blogSlug = (await params).slug;
    const body = await req.json();
    const validatedData = blogFormSchema.parse(body);

    const updated = await updateBlog(blogSlug, validatedData);
    return successResponse(updated, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("فایل نعتبر نیست", { status: 400 });
    }

    console.error("Error updating blog:", error);
    return errorResponse("خطای سرور", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const slug = (await params).slug;

  try {
    await deleteBlogBySlug(slug);
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

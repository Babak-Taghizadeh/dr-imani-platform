import { errorResponse, successResponse } from "@/lib/api-utils";
import { blogFormSchema } from "@/lib/validation-schema";
import { createBlog, getBlogs } from "@/utils/blog-services";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "6")),
    );

    const result = await getBlogs(page, limit);
    return successResponse(result);
  } catch (err) {
    console.error("Get blogs error:", err);
    return errorResponse("خطا در دریافت بلاگ‌ها", {
      status: 500,
      details: err,
      devDetails: true,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = blogFormSchema.parse(body);

    const blog = await createBlog(validatedData);
    return successResponse(blog, 201);
  } catch (err) {
    console.error("Create blog error:", err);
    return errorResponse(
      err instanceof Error ? err.message : "خطا در ایجاد بلاگ",
      {
        status: 400,
        details: err,
        devDetails: true,
      },
    );
  }
};

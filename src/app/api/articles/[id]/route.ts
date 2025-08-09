import { errorResponse, successResponse, validateId } from "@/lib/api-utils";
import { articleFormSchema } from "@/lib/validation-schema";
import { deleteArticle, updateArticle } from "@/utils/articles-services";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const id = (await params).id;
    const idNumber = parseInt(id);
    const body = await req.json();
    const validatedData = articleFormSchema.parse(body);

    const article = await updateArticle(idNumber, validatedData);
    return successResponse(article);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "خطا در به‌روزرسانی مقاله",
      {
        status: 400,
      },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const id = (await params).id;
    const validId = validateId(id);
    await deleteArticle(validId);
    return successResponse({ success: true });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "خطا در حذف مقاله",
      {
        status: 400,
      },
    );
  }
};

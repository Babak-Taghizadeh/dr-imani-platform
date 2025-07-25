import { errorResponse, successResponse, validateId } from "@/lib/api-utils";
import { ArticleUpdateSchema } from "@/lib/api-validators";
import { deleteArticle, updateArticle } from "@/utils/articles-services";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const id = validateId(params.id);
    const formData = await req.formData();

    const data = {
      id,
      title: formData.get("title"),
      summary: formData.get("summary"),
      publishedAt: formData.get("publishedAt"),
      file: formData.has("file") ? formData.get("file") : undefined,
    };

    const validated = ArticleUpdateSchema.parse(data);
    const article = await updateArticle(validated);
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
  { params }: { params: { id: string } },
) => {
  try {
    const id = validateId(params.id);
    await deleteArticle(id);
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

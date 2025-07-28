import { errorResponse, successResponse } from "@/lib/api-utils";
import { ArticleCreateSchema } from "@/lib/validation-schema";
import { createArticle, getArticles } from "@/utils/articles-services";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "6")),
    );
    const articles = await getArticles(page, limit);
    return successResponse(articles);
  } catch (err) {
    return errorResponse("خطا در دریافت مقالات", {
      status: 500,
      details: err,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const data = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      publishedAt: formData.get("publishedAt"),
      file: formData.get("file"),
    };

    const validated = ArticleCreateSchema.parse(data);
    const article = await createArticle(validated);
    return successResponse(article, 201);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "خطا در ایجاد مقاله",
      {
        status: 400,
      },
    );
  }
};

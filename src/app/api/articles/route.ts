import { errorResponse, successResponse } from "@/lib/api-utils";
import { articleFormSchema } from "@/lib/validation-schema";
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
    const body = await req.json();
    const validatedData = articleFormSchema.parse(body);

    const article = await createArticle(validatedData);
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

import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const blogId = parseInt(params.id);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog ID format" },
        { status: 400 },
      );
    }

    const blog = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        status: blogs.status,
        img: blogs.img,
        content: blogs.content,
        createdAt: blogs.createdAt,
      })
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .execute();

    if (!blog || blog.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog[0]);
  } catch (error) {
    console.error("Failed to fetch blog:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch blog",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 },
    );
  }
};

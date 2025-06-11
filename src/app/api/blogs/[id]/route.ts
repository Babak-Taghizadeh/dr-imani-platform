import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

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

export const PUT = async (
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

    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const status = formData.get("status") as string | null;
    const content = formData.get("content") as string | null;
    const file = formData.get("image") as File | null;

    if (!title || !status || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get current blog to check if we need to delete old image
    const currentBlog = await db
      .select({ img: blogs.img })
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .execute();

    if (!currentBlog || currentBlog.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    let imagePath = currentBlog[0].img;

    // Handle new image upload
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);

      // Delete old image file if it exists and is not the default
      if (currentBlog[0].img && currentBlog[0].img.startsWith("/uploads/")) {
        try {
          const oldImagePath = path.join(
            process.cwd(),
            "public",
            currentBlog[0].img,
          );
          await unlink(oldImagePath);
        } catch (error) {
          console.warn("Could not delete old image file:", error);
        }
      }

      imagePath = `/uploads/${fileName}`;
    }

    const updateData = {
      title,
      status,
      content,
      img: imagePath,
    };

    const [updatedBlog] = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, blogId))
      .returning();

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

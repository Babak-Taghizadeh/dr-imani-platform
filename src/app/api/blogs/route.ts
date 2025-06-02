import { db } from "@/db/db";
import { blogs } from "@/db/schema";
import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const status = formData.get("status") as string | null;
    const content = formData.get("content") as string | null;
    const file = formData.get("image") as File | null;

    console.log("FormData received:", { title, status, content, file });

    if (!title || !status || !content || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    console.log("Writing file to:", filePath);
    await writeFile(filePath, buffer);

    const blogData = {
      title,
      status,
      content,
      img: `/uploads/${fileName}`,
      createdAt: new Date(),
    };

    console.log("Inserting blog data:", blogData);

    const [insertedBlog] = await db.insert(blogs).values(blogData).returning();

    return NextResponse.json(insertedBlog, { status: 201 });
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    // Optimized query with explicit column selection
    const allBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        status: blogs.status,
        img: blogs.img,
        content: blogs.content,
        createdAt: blogs.createdAt,
      })
      .from(blogs)
      .orderBy(desc(blogs.createdAt))
      .execute(); // Explicit execution for clarity

    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);

    // Enhanced error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 },
    );
  }
};

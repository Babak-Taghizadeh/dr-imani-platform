import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import fs from "fs";

const uploadDir = join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const replaceKey = formData.get("replaceKey") as string | null;

    const originalName = file.name;
    const extension = originalName.split(".").pop()?.toLowerCase();

    if (!file) {
      return NextResponse.json(
        { message: "فایلی ارسال نشده" },
        { status: 400 },
      );
    }

    if (!extension || !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { message: "پسوند فایل مجاز نیست" },
        { status: 400 },
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "فرمت فایل باید تصویر یا PDF باشد" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "حجم فایل زیاد است" },
        { status: 400 },
      );
    }

    if (replaceKey) {
      const oldFilePath = join(uploadDir, replaceKey);
      try {
        await unlink(oldFilePath);
        console.error(`Deleted old image: ${replaceKey}`);
      } catch (err) {
        console.warn(`Couldn't delete previous image: ${replaceKey}`, err);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const shortHash = randomUUID().split("-")[0];
    const sanitizedName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^\w\-]/g, "-")
      .substring(0, 50);

    const filename = `${sanitizedName}-${shortHash}.${extension}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: filename,
      key: filename,
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { message: "کلید تصویر یافت نشد" },
        { status: 400 },
      );
    }

    const filePath = join(uploadDir, key);

    try {
      await unlink(filePath);
    } catch (err) {
      console.warn("فایل یافت نشد یا حذف شده:", key, err);
    }

    return NextResponse.json({ message: "تصویر حذف شد" });
  } catch (err) {
    console.error("خطا در حذف تصویر:", err);
    return NextResponse.json({ message: "خطا در حذف فایل" }, { status: 500 });
  }
};

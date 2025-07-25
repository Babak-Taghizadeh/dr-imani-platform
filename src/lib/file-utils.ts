import { writeFile, mkdir, unlink, stat } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const saveUploadedFile = async (file: File) => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "نوع فایل پشتیبانی نمی شود. لطفا فایل تصویر (JPEG, PNG, WebP)، PDF یا فایل Word (DOC/DOCX) آپلود کنید",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `حجم فایل از حد مجاز ${MAX_FILE_SIZE / 1024 / 1024} مگابایت بیشتر است`,
    );
  }

  const fileExt = path.extname(file.name).toLowerCase();
  const randomName = randomBytes(16).toString("hex");
  const fileName = `${randomName}${fileExt}`;

  await mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(UPLOAD_DIR, fileName);
  await writeFile(filePath, buffer);

  return {
    fileName,
    filePath: `/uploads/${fileName}`,
    mimeType: file.type,
    fileSize: file.size,
  };
};

export const deleteFile = async (filePath: string) => {
  const absolutePath = path.join(process.cwd(), "public", filePath);
  try {
    await stat(absolutePath);
    await unlink(absolutePath);
  } catch (err) {
    console.error("خطا در حذف فایل:", err);
    throw new Error("حذف فایل با خطا مواجه شد");
  }
};

export const validateFile = (file: File) => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "نوع فایل پشتیبانی نمی شود. لطفا فایل تصویر (JPEG, PNG, WebP)، PDF یا فایل Word (DOC/DOCX) آپلود کنید",
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `حجم فایل از حد مجاز ${MAX_FILE_SIZE / 1024 / 1024} مگابایت بیشتر است`,
    );
  }
  if (file.size === 0) {
    throw new Error("فایل خالی است");
  }
};

import { createReadStream, existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) => {
  const filename = (await params).filename;
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const stream = createReadStream(filePath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};

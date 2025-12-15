import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { resetPasswordSchema } from "@/lib/validation-schema";

function verifyResetToken(token: string): string | null {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");

    if (parts.length !== 4) {
      return null;
    }

    const [userId, expiresAtStr, randomBytes, signature] = parts;
    const payload = `${userId}:${expiresAtStr}:${randomBytes}`;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return null;
    }

    // Check expiration
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      return null;
    }

    return userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Verify token and extract user ID
    const userId = verifyResetToken(validatedData.token);

    if (!userId) {
      return NextResponse.json(
        { error: "توکن معتبر نیست یا منقضی شده است" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Update user password
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json(
      {
        message: "رمز عبور با موفقیت تغییر کرد",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "خطایی در تغییر رمز عبور رخ داد" },
      { status: 500 },
    );
  }
}

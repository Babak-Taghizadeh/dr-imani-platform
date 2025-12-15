import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  idNumber: z.string().min(1, "شماره شناسنامه الزامی است"),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست"),
});

const RESET_TOKEN_EXPIRY_HOURS = 1; // Token expires in 1 hour

function generateResetToken(userId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  const timestamp = Date.now();
  const expiresAt = timestamp + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
  const randomBytes = crypto.randomBytes(32).toString("hex");

  const payload = `${userId}:${expiresAt}:${randomBytes}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const token = `${payload}:${signature}`;
  return Buffer.from(token).toString("base64url");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Check if user exists with matching ID card number and phone number
    const user = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(
        and(
          eq(users.idNumber, validatedData.idNumber),
          eq(users.phoneNumber, validatedData.phoneNumber),
        ),
      )
      .limit(1);

    if (user.length === 0) {
      // Don't reveal which field is wrong for security
      return NextResponse.json(
        { error: "شماره شناسنامه یا شماره تلفن معتبر نیست" },
        { status: 404 },
      );
    }

    // Generate secure reset token
    const resetToken = generateResetToken(user[0].id);

    return NextResponse.json(
      {
        message: "لطفاً رمز عبور جدید را تنظیم کنید",
        token: resetToken,
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

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "خطایی در فرآیند بازیابی رمز عبور رخ داد" },
      { status: 500 },
    );
  }
}

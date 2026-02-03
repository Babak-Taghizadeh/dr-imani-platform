import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

const signupSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  idNumber: z.string().min(1, "کد ملی الزامی است"),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.SIGNUP);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "تعداد درخواست‌ها بیش از حد مجاز است",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMITS.SIGNUP.max),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetTime),
          },
        },
      );
    }

    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, validatedData.phoneNumber))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "کاربری با این شماره تلفن قبلاً ثبت‌نام کرده است" },
        { status: 409 },
      );
    }

    const existingIdNumber = await db
      .select()
      .from(users)
      .where(eq(users.idNumber, validatedData.idNumber))
      .limit(1);

    if (existingIdNumber.length > 0) {
      return NextResponse.json(
        { error: "کاربری با این کد ملی قبلاً ثبت‌نام کرده است" },
        { status: 409 },
      );
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS!);
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        idNumber: validatedData.idNumber,
        phoneNumber: validatedData.phoneNumber,
        passwordHash,
      })
      .returning({
        id: users.id,
        name: users.name,
        phoneNumber: users.phoneNumber,
      });

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت‌نام رخ داد" },
      { status: 500 },
    );
  }
}

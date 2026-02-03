import { NextRequest, NextResponse } from "next/server";
import { requireUser, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(1, "نام الزامی است").optional(),
  idNumber: z.string().min(1, "کد ملی الزامی است").optional(),
  phoneNumber: z.string().min(10, "شماره تلفن معتبر نیست").optional(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").optional(),
});

export async function GET() {
  try {
    const session = await requireUser();
    const userId = session.user.id;

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        idNumber: users.idNumber,
        phoneNumber: users.phoneNumber,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت اطلاعات کاربر رخ داد" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireUser();
    const userId = session.user.id;
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if phone number or id number already exists (if being updated)
    if (validatedData.phoneNumber) {
      const existingPhone = await db
        .select()
        .from(users)
        .where(eq(users.phoneNumber, validatedData.phoneNumber))
        .limit(1);

      if (existingPhone.length > 0 && existingPhone[0].id !== userId) {
        return NextResponse.json(
          { error: "شماره تلفن قبلاً استفاده شده است" },
          { status: 409 },
        );
      }
    }

    if (validatedData.idNumber) {
      const existingIdNumber = await db
        .select()
        .from(users)
        .where(eq(users.idNumber, validatedData.idNumber))
        .limit(1);

      if (existingIdNumber.length > 0 && existingIdNumber[0].id !== userId) {
        return NextResponse.json(
          { error: "کد ملی قبلاً استفاده شده است" },
          { status: 409 },
        );
      }
    }

    // Prepare update data
    const updateData: {
      updatedAt: Date;
      name?: string;
      idNumber?: string;
      phoneNumber?: string;
      passwordHash?: string;
    } = {
      updatedAt: new Date(),
    };

    if (validatedData.name) {
      updateData.name = validatedData.name;
    }
    if (validatedData.idNumber) {
      updateData.idNumber = validatedData.idNumber;
    }
    if (validatedData.phoneNumber) {
      updateData.phoneNumber = validatedData.phoneNumber;
    }
    if (validatedData.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS!);
      updateData.passwordHash = await bcrypt.hash(
        validatedData.password,
        saltRounds,
      );
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        idNumber: users.idNumber,
        phoneNumber: users.phoneNumber,
        updatedAt: users.updatedAt,
      });

    return NextResponse.json({
      message: "پروفایل با موفقیت به‌روزرسانی شد",
      user: updatedUser,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "خطایی در به‌روزرسانی پروفایل رخ داد" },
      { status: 500 },
    );
  }
}

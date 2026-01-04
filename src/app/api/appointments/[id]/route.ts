import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const role = session.user.role;
    const userId = session.user.id;

    // Get appointment with user info
    const appointmentData = await db
      .select({
        appointment: appointments,
        userName: users.name,
        userPhone: users.phoneNumber,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.id))
      .where(eq(appointments.id, id))
      .limit(1);

    if (appointmentData.length === 0) {
      return NextResponse.json(
        { error: "نوبت یافت نشد" },
        { status: 404 },
      );
    }

    const { appointment, userName, userPhone } = appointmentData[0];

    // Check authorization: user can only see their own appointments, admin can see all
    if (role === "user" && appointment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      appointment: {
        ...appointment,
        userName,
        userPhone,
      },
    });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت نوبت رخ داد" },
      { status: 500 },
    );
  }
}


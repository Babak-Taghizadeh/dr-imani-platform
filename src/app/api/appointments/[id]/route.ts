import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/db";
import { appointments, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت نوبت رخ داد" },
      { status: 500 },
    );
  }
}


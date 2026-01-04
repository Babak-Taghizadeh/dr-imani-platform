import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAuthError } from "@/lib/api-auth-helpers";
import { db } from "@/db/db";
import { appointments, users } from "@/db/schema";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import type { AppointmentStatus } from "@/types/types";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const statusParam = searchParams.get("status");
    const appointmentTypeParam = searchParams.get("appointmentType");
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (fromDate) {
      conditions.push(gte(appointments.date, fromDate));
    }
    if (toDate) {
      conditions.push(lte(appointments.date, toDate));
    }
    if (
      statusParam &&
      (statusParam === "PENDING" || statusParam === "CONFIRMED")
    ) {
      conditions.push(
        eq(appointments.status, statusParam as AppointmentStatus),
      );
    }
    if (
      appointmentTypeParam &&
      (appointmentTypeParam === "ONLINE_PHONE" ||
        appointmentTypeParam === "IN_CLINIC")
    ) {
      conditions.push(eq(appointments.appointmentType, appointmentTypeParam));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by clause - always sort by createdAt
    const orderByClause =
      sortOrder === "asc"
        ? asc(appointments.createdAt)
        : desc(appointments.createdAt);

    // Get appointments with user info
    const appointmentsData = await db
      .select({
        appointment: appointments,
        userName: users.name,
        userPhone: users.phoneNumber,
        userIdNumber: users.idNumber,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(whereClause);

    const total = totalCount[0]?.count || 0;

    return NextResponse.json({
      appointments: appointmentsData.map((item) => ({
        ...item.appointment,
        userName: item.userName,
        userPhone: item.userPhone,
        userIdNumber: item.userIdNumber,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (isAuthError(error)) {
      return error.response;
    }
    console.error("Get admin appointments error:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت نوبت‌ها رخ داد" },
      { status: 500 },
    );
  }
}

import { db } from "@/db/db";
import { appointments, users } from "@/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import type {
  Appointment,
  AppointmentWithUser,
  AppointmentStatus,
} from "@/types/types";

export const getAppointmentById = async (
  id: string,
  userId?: string,
): Promise<AppointmentWithUser | null> => {
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
    return null;
  }

  const { appointment, userName, userPhone } = appointmentData[0];

  // Check authorization: user can only see their own appointments
  if (userId && appointment.userId !== userId) {
    return null;
  }

  return {
    ...appointment,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    userName: userName || null,
    userPhone: userPhone || null,
  };
};

export const getUserAppointments = async (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
  },
): Promise<{
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const { page = 1, limit = 10 } = params || {};
  const offset = (page - 1) * limit;

  // Get appointments with pagination
  const userAppointments = await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(eq(appointments.userId, userId));

  const total = totalCount[0]?.count || 0;

  return {
    appointments: userAppointments.map((appointment) => ({
      ...appointment,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAdminAppointments = async (params: {
  fromDate?: string;
  toDate?: string;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
}): Promise<{
  appointments: AppointmentWithUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const { fromDate, toDate, status, page = 1, limit = 20 } = params;
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [];

  if (fromDate) {
    conditions.push(gte(appointments.date, fromDate));
  }
  if (toDate) {
    conditions.push(lte(appointments.date, toDate));
  }
  if (status) {
    conditions.push(eq(appointments.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get appointments with user info
  const appointmentsData = await db
    .select({
      appointment: appointments,
      userName: users.name,
      userPhone: users.phoneNumber,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.userId, users.id))
    .where(whereClause)
    .orderBy(desc(appointments.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(whereClause);

  const total = totalCount[0]?.count || 0;

  return {
    appointments: appointmentsData.map(
      ({ appointment, userName, userPhone }) => ({
        ...appointment,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
        userName: userName || null,
        userPhone: userPhone || null,
      }),
    ),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

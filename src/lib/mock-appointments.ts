import type {
  Appointment,
  AppointmentWithUser,
  AppointmentsResponse,
} from "@/lib/types";

// Mock data for testing appointments
export const MOCK_APPOINTMENTS: Appointment[] = Array.from(
  { length: 20 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const appointmentDate = date.toISOString().split("T")[0];
    const hours = 9 + (i % 8); // Hours from 9 to 16
    const minutes = i % 2 === 0 ? 0 : 30;
    const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    return {
      id: `mock-${i + 1}`,
      userId: `user-${i + 1}`,
      appointmentType: i % 2 === 0 ? "ONLINE_PHONE" : "IN_CLINIC",
      ageRange: i % 3 === 0 ? "UNDER_15" : "OVER_15",
      price: 500000 + i * 50000,
      date: appointmentDate,
      time: time,
      durationMinutes: 30,
      status: i % 4 === 0 ? "PENDING" : "CONFIRMED",
      paymentReference: i % 4 === 0 ? null : `PAY-${i + 1}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
);

export const LIMIT = 10;

// Check if an ID is a mock appointment ID
export function isMockAppointmentId(id: string): boolean {
  return id.startsWith("mock-");
}

// Get mock appointment by ID
export function getMockAppointmentById(id: string): AppointmentWithUser | null {
  const appointment = MOCK_APPOINTMENTS.find((apt) => apt.id === id);
  if (!appointment) {
    return null;
  }

  // Convert to AppointmentWithUser format (add user info)
  return {
    ...appointment,
    userName: `کاربر ${id.split("-")[1]}`,
    userPhone: `0912345678${id.split("-")[1].padStart(2, "0")}`,
  };
}

// Get paginated mock appointments
export function getMockAppointments(page: number): AppointmentsResponse {
  const startIndex = (page - 1) * LIMIT;
  const endIndex = startIndex + LIMIT;
  const paginatedAppointments = MOCK_APPOINTMENTS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(MOCK_APPOINTMENTS.length / LIMIT);

  return {
    appointments: paginatedAppointments,
    pagination: {
      page,
      limit: LIMIT,
      total: MOCK_APPOINTMENTS.length,
      totalPages,
    },
  };
}

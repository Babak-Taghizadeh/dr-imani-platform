import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  uuid,
  integer,
  date,
  time,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  imageKey: varchar("image_key", { length: 255 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  fileUrl: varchar("file_url", { length: 500 }),
  fileKey: varchar("file_key", { length: 255 }),
  scholarLink: varchar("scholar_link", { length: 1000 }),
  inputType: varchar("input_type", { length: 10 }).default("file"),
});

// Booking system tables
export const appointmentTypeEnum = pgEnum("appointment_type", [
  "ONLINE_PHONE",
  "IN_CLINIC",
]);

export const ageRangeEnum = pgEnum("age_range", ["UNDER_15", "OVER_15"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "SUCCESS",
  "FAILED",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  idNumber: varchar("id_number", { length: 50 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    appointmentType: appointmentTypeEnum("appointment_type").notNull(),
    ageRange: ageRangeEnum("age_range").notNull(),
    price: integer("price").notNull(),
    date: date("date").notNull(),
    time: time("time").notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(15),
    status: appointmentStatusEnum("status").notNull().default("PENDING"),
    // TODO: REPLACE WITH PAYMENT ID
    paymentReference: varchar("payment_reference", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      dateTimeIdx: index("date_time_idx").on(table.date, table.time),
      userIdIdx: index("user_id_idx").on(table.userId),
      dateIdx: index("date_idx").on(table.date),
      statusIdx: index("status_idx").on(table.status),
    };
  },
);

export const disabledDates = pgTable("disabled_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
  createdBy: varchar("created_by", { length: 100 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentLogs = pgTable("payment_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  gateway: varchar("gateway", { length: 50 }).notNull().default("SEP"),
  gatewayReference: varchar("gateway_reference", { length: 255 })
    .notNull()
    .unique(),
  status: paymentStatusEnum("status").notNull(),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [appointments.userId],
      references: [users.id],
    }),
    paymentLogs: many(paymentLogs),
  }),
);

export const paymentLogsRelations = relations(paymentLogs, ({ one }) => ({
  appointment: one(appointments, {
    fields: [paymentLogs.appointmentId],
    references: [appointments.id],
  }),
}));

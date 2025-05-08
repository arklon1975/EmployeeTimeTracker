import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User/Employee schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  role: text("role").notNull().default("employee"), // employee, supervisor, admin
  avatarInitials: text("avatar_initials"), // For display purposes
  active: boolean("active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  active: true,
});

// Time record schema (clock-in/clock-out events)
export const timeRecords = pgTable("time_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "clock-in", "clock-out"
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  notes: text("notes"),
});

export const insertTimeRecordSchema = createInsertSchema(timeRecords).omit({
  id: true,
  timestamp: true,
});

// Break record schema
export const breakRecords = pgTable("break_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "coffee", "lunch", "other"
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  notes: text("notes"),
});

export const insertBreakRecordSchema = createInsertSchema(breakRecords).omit({
  id: true,
  startTime: true,
  endTime: true,
});

// Status schema for user current status
export const userStatuses = pgTable("user_statuses", {
  userId: integer("user_id").primaryKey().references(() => users.id),
  status: text("status").notNull(), // "online", "break", "offline", "late"
  currentBreakId: integer("current_break_id").references(() => breakRecords.id),
  lastClockIn: timestamp("last_clock_in"),
  lastClockOut: timestamp("last_clock_out"),
  totalWorkTime: integer("total_work_time").default(0), // in seconds
  totalBreakTime: integer("total_break_time").default(0), // in seconds
  currentDate: timestamp("current_date").notNull().defaultNow(),
});

export const insertUserStatusSchema = createInsertSchema(userStatuses).omit({
  totalWorkTime: true,
  totalBreakTime: true,
  currentDate: true,
});

// Daily summary schema
export const dailySummaries = pgTable("daily_summaries", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalUsers: integer("total_users").notNull(),
  presentUsers: integer("present_users").notNull(),
  onBreakUsers: integer("on_break_users").notNull(),
  absentUsers: integer("absent_users").notNull(),
  lateUsers: integer("late_users").notNull(),
  totalWorkHours: integer("total_work_hours").notNull(), // in minutes
  totalBreakTime: integer("total_break_time").notNull(), // in minutes
  statsData: jsonb("stats_data"), // For storing attendance percentages, etc.
});

export const insertDailySummarySchema = createInsertSchema(dailySummaries).omit({
  id: true,
});

// Activity log schema
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // "clock-in", "clock-out", "break-start", "break-end", etc.
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  details: jsonb("details"),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TimeRecord = typeof timeRecords.$inferSelect;
export type InsertTimeRecord = z.infer<typeof insertTimeRecordSchema>;

export type BreakRecord = typeof breakRecords.$inferSelect;
export type InsertBreakRecord = z.infer<typeof insertBreakRecordSchema>;

export type UserStatus = typeof userStatuses.$inferSelect;
export type InsertUserStatus = z.infer<typeof insertUserStatusSchema>;

export type DailySummary = typeof dailySummaries.$inferSelect;
export type InsertDailySummary = z.infer<typeof insertDailySummarySchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// Helper enums
export enum UserRole {
  EMPLOYEE = "employee",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
}

export enum UserStatusType {
  ONLINE = "online",
  BREAK = "break",
  OFFLINE = "offline",
  LATE = "late",
}

export enum BreakType {
  COFFEE = "coffee",
  LUNCH = "lunch",
  OTHER = "other",
}

export enum TimeRecordType {
  CLOCK_IN = "clock-in",
  CLOCK_OUT = "clock-out",
}

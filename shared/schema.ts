import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().$type<"admin" | "technician" | "manager">(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Client model
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Vehicle model (attached to clients)
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  plate: text("plate"),
  chassis: text("chassis"),
  color: text("color"),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

// Service model (orders)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  vehicleId: integer("vehicle_id"),
  vehicleName: text("vehicle_name").notNull(),
  vehiclePlate: text("vehicle_plate"),
  vehicleChassis: text("vehicle_chassis"),
  date: timestamp("date").notNull(),
  technicianId: integer("technician_id").notNull(),
  technicianName: text("technician_name").notNull(),
  serviceType: text("service_type").notNull().$type<"street_dent" | "hail" | "other">(),
  serviceValue: integer("service_value").notNull(), // Stored in cents
  administrativeValue: integer("administrative_value"), // Stored in cents, admin only
  status: text("status").notNull().$type<"pending" | "in_progress" | "completed">(),
  images: json("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Budget/Quote model (for future implementation)
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  vehicleId: integer("vehicle_id"),
  vehicleName: text("vehicle_name").notNull(),
  date: timestamp("date").notNull(),
  estimatedValue: integer("estimated_value").notNull(), // Stored in cents
  description: text("description").notNull(),
  status: text("status").notNull().$type<"pending" | "approved" | "rejected">(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true, createdAt: true });
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

import { InferSelectModel } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const listings = sqliteTable("listings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  status: text("status").$type<ListingStatus>().default("PENDING").notNull(),
  submittedBy: text("submitted_by").notNull(),
  submittedAt: text("submitted_at").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  adminId: text("admin_id").references(() => admins.id),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  action: text("action").$type<AuditActions>().default("create").notNull(),
  listingId: text("listing_id").references(() => listings.id).notNull(),
  adminId: text("admin_id").references(() => admins.id).notNull(),
  details: text("details").notNull(),
});

export type Admin = InferSelectModel<typeof admins>;
export type Listing = InferSelectModel<typeof listings>;
export type AuditLog = InferSelectModel<typeof auditLogs>;
export type AuditActions = "create" | "approve" | "edit" | "reject";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";

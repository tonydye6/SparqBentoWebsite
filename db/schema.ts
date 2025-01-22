import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const betaSignups = pgTable("beta_signups", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  subscribed: boolean("subscribed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertBetaSignupSchema = createInsertSchema(betaSignups);
export const selectBetaSignupSchema = createSelectSchema(betaSignups);
export type InsertBetaSignup = typeof betaSignups.$inferInsert;
export type SelectBetaSignup = typeof betaSignups.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

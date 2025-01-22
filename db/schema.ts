import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertAdminSchema = createInsertSchema(adminUsers);
export const selectAdminSchema = createSelectSchema(adminUsers);
export type InsertAdmin = typeof adminUsers.$inferInsert;
export type SelectAdmin = typeof adminUsers.$inferSelect;

// New tables for content management
export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'AI' | 'Gaming' | 'NCAA'
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertNewsItemSchema = createInsertSchema(newsItems);
export const selectNewsItemSchema = createSelectSchema(newsItems);
export type InsertNewsItem = typeof newsItems.$inferInsert;
export type SelectNewsItem = typeof newsItems.$inferSelect;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  photo: text("photo").notNull(),
  linkedIn: text("linked_in").notNull(),
  previousCompanies: text("previous_companies").array().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export const selectTeamMemberSchema = createSelectSchema(teamMembers);
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type SelectTeamMember = typeof teamMembers.$inferSelect;
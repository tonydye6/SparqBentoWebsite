import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from 'drizzle-orm';

export const betaSignups = pgTable("beta_signups", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  subscribed: boolean("subscribed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertBetaSignupSchema = createInsertSchema(betaSignups);
export const selectBetaSignupSchema = createSelectSchema(betaSignups);
export type InsertBetaSignup = typeof betaSignups.$inferInsert;
export type SelectBetaSignup = typeof betaSignups.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertAdminSchema = createInsertSchema(adminUsers);
export const selectAdminSchema = createSelectSchema(adminUsers);
export type InsertAdmin = typeof adminUsers.$inferInsert;
export type SelectAdmin = typeof adminUsers.$inferSelect;

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  url: text("url"),
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

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sessionId: text("session_id").notNull()
});

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type SelectChatMessage = typeof chatMessages.$inferSelect;

export const betaSignupsRelations = relations(betaSignups, ({ }) => ({
}));

export const adminUsersRelations = relations(adminUsers, ({ }) => ({
}));

export const newsItemsRelations = relations(newsItems, ({ }) => ({
}));

export const teamMembersRelations = relations(teamMembers, ({ }) => ({
}));

export const chatMessagesRelations = relations(chatMessages, ({ }) => ({
}));
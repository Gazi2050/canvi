import { boolean, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export type ProjectMember = {
  id: string
  email: string
  role: "owner" | "editor" | "viewer"
  createdAt: string
  updatedAt: string
}

export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ownerEmail: text("owner_email").notNull(),
  title: text("title"),
  content: jsonb("content").notNull().default(sql`'{}'::jsonb`),
  isPublic: boolean("is_public").notNull().default(false),
  members: jsonb("members").$type<ProjectMember[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
})
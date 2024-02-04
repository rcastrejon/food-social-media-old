import { sql } from "drizzle-orm"
import { blob, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),

  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),

  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const recipeTable = sqliteTable("recipe", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  title: text("title").notNull(),
  content: blob("content", { mode: "json" })
    .$type<{ ingredients: Array<{ content: string }> }>()
    .notNull(),

  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

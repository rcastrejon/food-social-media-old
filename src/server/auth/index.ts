import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"

import { db } from "~/server/db"
import { sessionTable, userTable } from "~/server/db/schema"

// @ts-expect-error: LibSQL adapter types seem to be broken
const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes) {
    return {
      username: attributes.username,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  username: string
}

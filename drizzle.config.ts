import { type Config } from "drizzle-kit"

import { env } from "~/env"

export default {
  schema: "./src/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config

import { object, parse, string } from "valibot"

const envSchema = object({
  // NODE_ENV: picklist(["development", "production", "test"]),
  DATABASE_URL: string(),
})

export const env = parse(envSchema, process.env)

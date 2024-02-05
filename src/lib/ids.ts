import { generateId } from "lucia"

const prefixes = {
  user: "user",
  recipe: "recipe",
} as const

export function newId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], generateId(15)].join("_")
}

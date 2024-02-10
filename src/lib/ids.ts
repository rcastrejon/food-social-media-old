import { generateId } from "lucia"

export const prefixes = {
  user: "user",
  recipe: "recipe",
  media: "media",
} as const

export function newId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], generateId(15)].join("_")
}

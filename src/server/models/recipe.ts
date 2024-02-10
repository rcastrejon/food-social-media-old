import "server-only"

import { desc } from "drizzle-orm"

import type { RecipeInsert } from "../db/schema"
import { newId } from "~/lib/ids"
import { db } from "../db"
import { recipeTable } from "../db/schema"

export async function createRecipe({
  title,
  ingredients,
  userId,
  mediaKey,
}: Omit<RecipeInsert, "content" | "id"> & {
  ingredients: RecipeInsert["content"]["ingredients"]
}) {
  const { rowsAffected } = await db.insert(recipeTable).values({
    id: newId("recipe"),
    title,
    content: {
      ingredients,
    },
    userId,
    mediaKey,
  })
  return rowsAffected === 1
}

export async function getRecipes(limit: number, offset: number) {
  return await db.query.recipeTable.findMany({
    orderBy: [desc(recipeTable.createdAt)],
    limit,
    offset,
    with: {
      media: {
        columns: {
          url: true,
        },
      },
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
    },
  })
}

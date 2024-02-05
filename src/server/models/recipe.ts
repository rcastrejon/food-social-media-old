import "server-only"

import { newId } from "~/lib/ids"
import { db } from "../db"
import { recipeTable } from "../db/schema"

export async function createRecipe({
  userId,
  title,
  ingredients,
}: {
  userId: string
  title: string
  ingredients: Array<{
    content: string
  }>
}) {
  const { rowsAffected } = await db.insert(recipeTable).values({
    id: newId("recipe"),
    userId,
    title,
    content: {
      ingredients,
    },
  })
  return rowsAffected === 1
}

// only for testing.
export async function getRecipes() {
  return await db.query.recipeTable.findMany()
}

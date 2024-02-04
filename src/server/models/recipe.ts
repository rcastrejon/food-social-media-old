import "server-only"

import { db } from "../db"
import { recipeTable } from "../db/schema"

type Recipe = {
  userId: string
  title: string
  ingredients: Array<{ content: string }>
}

export async function createRecipe({ userId, title, ingredients }: Recipe) {
  const { rowsAffected } = await db.insert(recipeTable).values({
    id: "test",
    userId,
    title,
    content: {
      ingredients,
    },
  })
  return rowsAffected === 1
}

export async function getRecipes() {
  return await db.query.recipeTable.findMany()
}

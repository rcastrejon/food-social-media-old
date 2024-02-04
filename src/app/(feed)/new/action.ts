"use server"

import { redirect } from "next/navigation"

import { NewRecipeSchema } from "~/lib/validators/new-recipe"
import { createRecipe } from "~/server/models/recipe"
import { authAction } from "~/server/safe-action"

export const postRecipe = authAction(
  NewRecipeSchema,
  async (recipe, { user }) => {
    await createRecipe({
      userId: user.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
    })
    redirect("/")
  },
)

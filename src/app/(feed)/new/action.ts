"use server"

import { redirect } from "next/navigation"

import { PostRecipeSchema } from "~/lib/validators/recipe"
import { createRecipe } from "~/server/models/recipe"
import { authAction } from "~/server/safe-action"

export const postRecipe = authAction(
  PostRecipeSchema,
  async (recipe, { user }) => {
    await createRecipe({
      userId: user.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
    })
    redirect("/")
  },
)

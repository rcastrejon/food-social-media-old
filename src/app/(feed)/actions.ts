"use server"

import { getRecipes } from "~/server/models/recipe"

export async function getFeed(page: number) {
  const itemsPerPage = 2
  const offset = (page - 1) * itemsPerPage
  const rows = await getRecipes(itemsPerPage + 1, offset)
  if (rows.length > itemsPerPage) {
    return { rows: rows.slice(0, itemsPerPage), nextPage: page + 1 }
  }
  return { rows, nextPage: null }
}

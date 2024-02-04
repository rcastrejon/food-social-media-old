import type { Input } from "valibot"
import { array, minLength, object, string, toTrimmed } from "valibot"

export const IngredientSchema = object({
  content: string([
    toTrimmed(),
    minLength(1, "El ingrediente no puede estar vacío."),
  ]),
})

export const NewRecipeSchema = object({
  title: string([toTrimmed(), minLength(1, "Agrégale un título a tu receta.")]),
  ingredients: array(IngredientSchema, [
    minLength(1, "Agrega al menos un ingrediente."),
  ]),
})

export type NewRecipeInput = Input<typeof NewRecipeSchema>

"use client"

import type { UseFormReturn } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useAction } from "next-safe-action/hooks"
import { useFieldArray, useForm } from "react-hook-form"

import type { NewRecipeInput } from "~/lib/validators/new-recipe"
import { SubmitButton } from "~/components/submit-button"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { NewRecipeSchema } from "~/lib/validators/new-recipe"
import { postRecipe } from "./action"

export function NewRecipeForm() {
  const form = useForm<NewRecipeInput>({
    resolver: valibotResolver(NewRecipeSchema),
    defaultValues: {
      title: "",
      ingredients: [{ content: "" }],
    },
  })
  const { execute, status } = useAction(postRecipe)

  function onSubmit(values: NewRecipeInput) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Puede ser el nombre de la receta o un nombre que la describa.
                ¡Sé creativo!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <IngredientListFieldArray form={form} />
        <SubmitButton className="w-full" isSubmitting={status === "executing"}>
          Publicar
        </SubmitButton>
      </form>
    </Form>
  )
}

// TODO: Investigate useFieldArray and possibly refactor this component
function IngredientListFieldArray({
  form,
}: {
  form: UseFormReturn<NewRecipeInput>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  async function addIngredient() {
    // Add a field only if the last field is valid
    const lastFieldName = `ingredients.${fields.length - 1}.content` as const
    const isValid = await form.trigger(lastFieldName)
    if (isValid) {
      append({ content: "" })
    } else {
      form.setFocus(lastFieldName)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label>Ingredientes</Label>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`ingredients.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex w-full items-center gap-2">
                    <Input {...field} />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <span className="i-[lucide--trash-2] h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <Button
        className="w-full"
        variant="secondary"
        type="button"
        onClick={addIngredient}
      >
        Nuevo ingrediente
      </Button>
    </div>
  )
}

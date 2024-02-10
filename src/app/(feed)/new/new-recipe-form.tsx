"use client"

import type { UseFormReturn } from "react-hook-form"
import { useEffect, useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useAction } from "next-safe-action/hooks"
import { useFieldArray, useForm } from "react-hook-form"

import type { PostRecipeInput } from "~/lib/validators/recipe"
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
import { processImage } from "~/lib/image"
import { UploadDropzone } from "~/lib/uploadthing"
import { PostRecipeSchema } from "~/lib/validators/recipe"
import { postRecipe } from "./action"

export function NewRecipeForm() {
  const form = useForm<PostRecipeInput>({
    resolver: valibotResolver(PostRecipeSchema),
    defaultValues: {
      title: "",
      ingredients: [{ content: "" }],
    },
  })
  const { execute, status } = useAction(postRecipe)

  const [imageKey, setImageKey] = useState<string | undefined>(undefined)
  const { unregister, register } = form
  useEffect(() => {
    unregister("mediaKey")
  }, [imageKey, unregister])

  function onSubmit(values: PostRecipeInput) {
    execute(values)
  }

  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onBeforeUploadBegin={async (files) => {
          return await Promise.all(
            files.map(async (file) => {
              const blob = await processImage(await file.arrayBuffer())
              return new File([blob], file.name, {
                type: blob.type,
              })
            }),
          )
        }}
        onClientUploadComplete={(res) => {
          if (res[0]) {
            setImageKey(res[0].key)
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <input {...register("mediaKey", { value: imageKey })} type="hidden" />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>¡Sé creativo!</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <IngredientListFieldArray form={form} />
          <SubmitButton
            className="w-full"
            isSubmitting={status === "executing"}
          >
            Publicar
          </SubmitButton>
        </form>
      </Form>
    </>
  )
}

// TODO: investigate useFieldArray and possibly refactor this component
function IngredientListFieldArray({
  form,
}: {
  form: UseFormReturn<PostRecipeInput>
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

"use client"

import { useEffect } from "react"
import { useAction } from "next-safe-action/hooks"
import { useFieldArray, useFormContext } from "react-hook-form"

import type { PostRecipeInput } from "~/lib/validators/recipe"
import { SubmitButton } from "~/components/submit-button"
import { Button } from "~/components/ui/button"
import {
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
import { UploadButton } from "~/lib/uploadthing"
import { postRecipe } from "./action"
import {
  useNewRecipeFormActorRef,
  useNewRecipeFormSelector,
} from "./form-provider"

export function UploadImageButton() {
  const actorRef = useNewRecipeFormActorRef()
  const mediaKey = useNewRecipeFormSelector((state) => state.context.mediaKey)
  const isImageLoaded = mediaKey !== undefined

  function removeImage() {
    actorRef.send({
      type: "image.remove",
    })
  }

  if (isImageLoaded) {
    return (
      <div>
        <p>image loaded: {mediaKey}</p>
        <button onClick={removeImage}>delete</button>
      </div>
    )
  }
  return (
    <UploadButton
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
        const uploadResponse = res[0]
        if (uploadResponse) {
          actorRef.send({
            type: "image.load",
            mediaKey: uploadResponse.key,
          })
        }
      }}
    />
  )
}

export function NewRecipeForm() {
  const { status, execute } = useAction(postRecipe)
  const { control, handleSubmit, setValue } = useFormContext<PostRecipeInput>()

  const mediaKey = useNewRecipeFormSelector((state) => state.context.mediaKey)
  const disabled = !mediaKey

  function onSubmit(values: PostRecipeInput) {
    execute(values)
  }

  useEffect(() => {
    setValue("mediaKey", mediaKey ?? "")
  }, [mediaKey, setValue])

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={control}
        disabled={disabled}
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
      <IngredientListFieldArray disabled={disabled} />
      <SubmitButton
        type="submit"
        disabled={disabled}
        className="w-full"
        isSubmitting={status === "executing"}
      >
        Publicar
      </SubmitButton>
    </form>
  )
}

function IngredientListFieldArray({ disabled }: { disabled: boolean }) {
  const { control, trigger } = useFormContext<PostRecipeInput>()
  const { fields, append } = useFieldArray({
    control: control,
    name: "ingredients",
  })

  async function addIngredient() {
    const isValid = await trigger("ingredients", { shouldFocus: true })
    if (isValid) {
      append({ content: "" })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label>Ingredientes</Label>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            disabled={disabled}
            control={control}
            name={`ingredients.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
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
        disabled={disabled}
      >
        Nuevo ingrediente
      </Button>
    </div>
  )
}

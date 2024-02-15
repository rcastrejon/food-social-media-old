"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { createActorContext } from "@xstate/react"
import { useForm } from "react-hook-form"
import { assign, createMachine } from "xstate"

import type { PostRecipeInput } from "~/lib/validators/recipe"
import { Form } from "~/components/ui/form"
import { PostRecipeSchema } from "~/lib/validators/recipe"

export const newRecipeFormMachine = createMachine({
  types: {} as {
    context: {
      mediaKey: string | undefined
    }
    events:
      | {
          type: "image.load"
          mediaKey: string
        }
      | {
          type: "image.remove"
        }
    actions: {
      type: "formCleanup"
    }
  },
  id: "newRecipeForm",
  context: {
    mediaKey: undefined,
  },
  initial: "imageStage",
  states: {
    imageStage: {
      on: {
        "image.load": {
          target: "formStage",
          actions: assign({
            mediaKey: ({ event }) => event.mediaKey,
          }),
        },
      },
    },
    formStage: {
      on: {
        "image.remove": {
          target: "imageStage",
          actions: [
            "formCleanup",
            assign({
              mediaKey: () => undefined,
            }),
          ],
        },
      },
    },
  },
})

const NewRecipeFormContext = createActorContext(newRecipeFormMachine)

export function NewRecipeFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const form = useForm<PostRecipeInput>({
    resolver: valibotResolver(PostRecipeSchema),
    defaultValues: {
      title: "",
      ingredients: [{ content: "" }],
      mediaKey: "",
    },
  })
  const { clearErrors } = form

  return (
    <Form {...form}>
      <NewRecipeFormContext.Provider
        logic={newRecipeFormMachine.provide({
          actions: {
            formCleanup: () => clearErrors(),
          },
        })}
      >
        {children}
      </NewRecipeFormContext.Provider>
    </Form>
  )
}

export const useNewRecipeFormActorRef = NewRecipeFormContext.useActorRef

export const useNewRecipeFormSelector = NewRecipeFormContext.useSelector

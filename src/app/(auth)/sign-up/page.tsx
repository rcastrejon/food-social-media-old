"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { SignUpInput } from "~/lib/validators/auth"
import { SubmitButton } from "~/components/submit-button"
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
import { SignUpSchema } from "~/lib/validators/auth"
import { signUp } from "../actions"

export default function Page() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect-to") ?? undefined

  return (
    <main className="mx-auto w-full max-w-96 lg:w-96">
      <div className="flex flex-col space-y-1.5 pb-6">
        <h2 className="font-serif text-2xl font-semibold leading-none tracking-tight">
          Crea una cuenta nueva
        </h2>
        <p className="text-sm text-muted-foreground">
          Ya tienes cuenta?{" "}
          <Link
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            href={`/sign-in${redirectTo ? `?redirect-to=${redirectTo}` : ""}`}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
      <SignUpForm redirectTo={redirectTo} />
    </main>
  )
}

function SignUpForm({ redirectTo }: { redirectTo: string | undefined }) {
  const form = useForm<SignUpInput>({
    resolver: valibotResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  })
  const { execute, status } = useAction(signUp, {
    onSettled: ({ data }) => {
      if (data?.error) {
        toast.error("Ocurrió un error", {
          description: data.error,
        })
      }
    },
  })

  async function onSubmit(values: SignUpInput) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <input
          {...form.register("redirectTo", { value: redirectTo })}
          type="hidden"
          hidden
          aria-hidden
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" maxLength={15} {...field} />
              </FormControl>
              <FormDescription>
                Este nombre será visible para otros usuarios. Solo puede
                contener letras, números y guiones bajos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                La contraseña debe tener al menos 8 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="w-full" isSubmitting={status === "executing"}>
          Registrarte
        </SubmitButton>
      </form>
    </Form>
  )
}

"use client"

import Link from "next/link"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"

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

export default function Page() {
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
            href="/sign-in"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
      <SignUpForm />
    </main>
  )
}

function SignUpForm() {
  const form = useForm<SignUpInput>({
    resolver: valibotResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  })

  async function onSubmit(values: SignUpInput) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
        <SubmitButton className="w-full" isSubmitting={false}>
          Registrarte
        </SubmitButton>
      </form>
    </Form>
  )
}

"use client"

import Link from "next/link"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"

import type { SignInInput } from "~/lib/validators/auth"
import { SubmitButton } from "~/components/submit-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { SignInSchema } from "~/lib/validators/auth"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-96 lg:w-96">
      <div className="flex flex-col space-y-1.5 pb-6">
        <h2 className="font-serif text-2xl font-semibold leading-none tracking-tight">
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted-foreground">
          No tienes cuenta?{" "}
          <Link
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            href="/sign-up"
          >
            Regístrate
          </Link>
        </p>
      </div>
      <SignInForm />
    </main>
  )
}

function SignInForm() {
  const form = useForm<SignInInput>({
    resolver: valibotResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInInput) {
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
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="w-full" isSubmitting={false}>
          Iniciar sesión
        </SubmitButton>
      </form>
    </Form>
  )
}

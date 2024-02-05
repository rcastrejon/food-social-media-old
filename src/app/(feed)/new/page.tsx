import { redirect } from "next/navigation"

import { validateRequest } from "~/server/auth/validate-request"
import { NewRecipeForm } from "./new-recipe-form"

export default async function Page() {
  const { user } = await validateRequest()
  if (!user) {
    return redirect("/sign-in?redirect-to=/new")
  }
  return (
    <main className="flex min-h-screen flex-col px-6 py-12">
      <div className="flex flex-col gap-1.5 pb-6">
        <h2 className="font-serif text-2xl font-semibold leading-none tracking-tight">
          Nueva receta
        </h2>
        <p className="text-sm text-muted-foreground">
          Publica una receta para que otros usuarios puedan disfrutarla.
        </p>
      </div>
      <NewRecipeForm />
    </main>
  )
}

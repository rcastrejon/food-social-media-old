import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "~/components/ui/button"
import { lucia } from "~/server/auth"
import { validateRequest } from "~/server/auth/validate-request"

export default async function Page() {
  const { user } = await validateRequest()

  return (
    <main className="min-h-screen space-y-1.5">
      <h2 className="font-serif text-2xl font-semibold leading-none tracking-tight">
        Hola, mundo!
      </h2>
      <Button size="sm">Noop</Button>
      <Button size="sm" asChild>
        <Link href="/sign-up">Registrarte</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/sign-in">Iniciar sesión</Link>
      </Button>
      {user && (
        <form
          action={async () => {
            "use server"
            const { session } = await validateRequest()
            if (!session) {
              return {
                error: "Unauthorized",
              }
            }

            await lucia.invalidateSession(session.id)

            const sessionCookie = lucia.createBlankSessionCookie()
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes,
            )
            return redirect("/")
          }}
        >
          <Button type="submit" size="sm" variant="destructive">
            Cerrar sesión
          </Button>
        </form>
      )}
    </main>
  )
}

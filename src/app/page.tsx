import Link from "next/link"

import { Button } from "~/components/ui/button"

export default function Page() {
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
        <Link href="#">Iniciar sesión</Link>
      </Button>
    </main>
  )
}

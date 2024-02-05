import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { lucia } from "."

export async function createUserSession({
  userId,
  redirectTo,
}: {
  userId: string
  redirectTo?: string
}) {
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
  if (redirectTo) {
    redirect(redirectTo)
  }
}

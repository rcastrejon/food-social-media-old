"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SignInSchema, SignUpSchema } from "~/lib/validators/auth"
import { lucia } from "~/server/auth"
import { createUser, verifyUsernamePassword } from "~/server/models/user"
import { action } from "~/server/safe-action"

async function createUserSession(userId: string) {
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
  redirect("/")
}

export const signUp = action(SignUpSchema, async ({ username, password }) => {
  const userCreated = await createUser({ username, password })
  if (userCreated.error) {
    return {
      error: "Este nombre de usuario ya está en uso. Por favor, elige otro.",
    }
  }
  await createUserSession(userCreated.userId)
})

export const signIn = action(SignInSchema, async ({ username, password }) => {
  const validUser = await verifyUsernamePassword({ username, password })
  if (validUser.error) {
    return { error: "Nombre de usuario o contraseña incorrectos." }
  }
  await createUserSession(validUser.userId)
})

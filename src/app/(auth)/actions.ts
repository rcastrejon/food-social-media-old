"use server"

import { SignInSchema, SignUpSchema } from "~/lib/validators/auth"
import { createUserSession } from "~/server/auth/session"
import { createUser, verifyUsernamePassword } from "~/server/models/user"
import { action } from "~/server/safe-action"

export const signUp = action(
  SignUpSchema,
  async ({ username, password, redirectTo }) => {
    const userCreated = await createUser(username, password)
    if (userCreated.error === "username-taken") {
      return {
        error: "Este nombre de usuario ya está en uso. Por favor, elige otro.",
      }
    }
    await createUserSession({
      userId: userCreated.userId,
      redirectTo: redirectTo ?? "/",
    })
  },
)

export const signIn = action(
  SignInSchema,
  async ({ username, password, redirectTo }) => {
    const valid = await verifyUsernamePassword(username, password)
    if (valid.error === "invalid-username-pass") {
      return { error: "Nombre de usuario o contraseña incorrectos." }
    }
    await createUserSession({
      userId: valid.user.id,
      redirectTo: redirectTo ?? "/",
    })
  },
)

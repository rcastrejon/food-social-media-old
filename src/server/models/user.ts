import "server-only"

import { DrizzleError } from "drizzle-orm/errors"
import { sql } from "drizzle-orm/sql"
import { generateId } from "lucia"
import { Argon2id } from "oslo/password"

import { db } from "../db"
import { userTable } from "../db/schema"

export async function getUserByUsername(username: string) {
  return await db.query.userTable.findFirst({
    where: sql`${userTable.username} = ${username} COLLATE NOCASE`,
  })
}

export async function createUser({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const hashedPassword = await new Argon2id().hash(password)
  const userId = generateId(15)

  // check if username is unique, for that we have to do a case insensitive search.
  // if the username is unique, create the user.
  try {
    await db.transaction(async (tx) => {
      const existingUser = await tx.query.userTable.findFirst({
        where: sql`${userTable.username} = ${username} COLLATE NOCASE`,
      })
      if (existingUser) {
        tx.rollback()
        return
      }
      await tx.insert(userTable).values({
        id: userId,
        username,
        hashedPassword,
      })
    })
  } catch (e) {
    if (e instanceof DrizzleError) {
      return {
        error: "username-taken" as const,
      }
    }
  }
  return { userId }
}

export async function verifyUsernamePassword({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const existingUser = await getUserByUsername(username)
  if (!existingUser) {
    return { error: "username-password-error" as const }
  }
  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password,
  )
  if (!validPassword) {
    return { error: "username-password-error" as const }
  }
  return { userId: existingUser.id }
}

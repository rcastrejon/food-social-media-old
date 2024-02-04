import { createSafeActionClient } from "next-safe-action"

import { validateRequest } from "./auth/validate-request"

export const action = createSafeActionClient()

export const authAction = createSafeActionClient({
  async middleware() {
    const { session, user } = await validateRequest()
    if (!session) {
      throw new Error("Unauthorized")
    }
    return { session, user }
  },
})

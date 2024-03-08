import { z } from "zod"

import { username } from "@/lib/validators"

export const UsernameSchema = z.object({
  username,
})

export type UsernameType = z.infer<typeof UsernameSchema>

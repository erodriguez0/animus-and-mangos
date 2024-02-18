import { z } from "zod"

import { email, password, username } from "@/lib/validators"

export const LoginSchema = z.object({
  identifier: z.union([email, username]),
  password,
})

export type LoginType = z.infer<typeof LoginSchema>

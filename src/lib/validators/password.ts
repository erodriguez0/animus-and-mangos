import { z } from "zod"

import { password } from "@/lib/validators"

export const PasswordSchema = z
  .object({
    password,
    confirm: password,
    current: password,
  })
  .refine(
    ({ password, confirm }) => {
      return password === confirm
    },
    {
      path: ["confirm"],
      message: "New password and confirmation do not match",
    },
  )

export type PasswordType = z.infer<typeof PasswordSchema>

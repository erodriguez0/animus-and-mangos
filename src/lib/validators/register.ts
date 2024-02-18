import { z } from "zod"

import { email, password } from "@/lib/validators"

export const RegisterSchema = z
  .object({
    email,
    password,
    confirm: password,
  })
  .refine(
    ({ password, confirm }) => {
      return password === confirm
    },
    {
      path: ["confirm"],
      message: "Passwords do not match",
    },
  )

export type RegisterType = z.infer<typeof RegisterSchema>

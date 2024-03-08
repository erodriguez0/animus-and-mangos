import { z } from "zod"

export const AvatarSchema = z.object({
  avatar: z.string().url(),
})

export type AvatarType = z.infer<typeof AvatarSchema>

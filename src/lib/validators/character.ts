import { z } from "zod"

export const CharacterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.union([z.literal(""), z.string().url()]),
  bio: z.string(),
  gender: z.string(),
  anime: z.string().cuid().array(),
  manga: z.string().cuid().array(),
})

export type CharacterType = z.infer<typeof CharacterSchema>

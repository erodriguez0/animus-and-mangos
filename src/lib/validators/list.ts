import { z } from "zod"

export enum TypesOfLists {
  ANIME = "ANIME",
  MANGA = "MANGA",
  CHARACTER = "CHARACTER",
}

export const ListSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .default(""),
  type: z.nativeEnum(TypesOfLists),
})

export type ListType = z.infer<typeof ListSchema>

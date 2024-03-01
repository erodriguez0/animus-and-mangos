import { z } from "zod"

export const ListAnimeSchema = z.object({
  anime_id: z.string(),
  list_id: z.string(),
})

export type ListAnimeType = z.infer<typeof ListAnimeSchema>

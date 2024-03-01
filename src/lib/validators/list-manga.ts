import { z } from "zod"

export const ListMangaSchema = z.object({
  manga_id: z.string(),
  list_id: z.string(),
})

export type ListMangaType = z.infer<typeof ListMangaSchema>

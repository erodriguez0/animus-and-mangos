import { MangaFormat, MangaStatus } from "@prisma/client"
import { z } from "zod"

export const MangaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  poster: z.union([z.literal(""), z.string().url()]),
  format: z.union([z.literal(""), z.nativeEnum(MangaFormat)]),
  status: z.union([z.literal(""), z.nativeEnum(MangaStatus)]),
  volumes: z.union([
    z.literal(""),
    z.coerce
      .number()
      .int("Volume(s) must be an integer")
      .min(1, "Volume(s) must be a positive number"),
  ]),
  chapters: z.union([
    z.literal(""),
    z.coerce
      .number()
      .int("Volume(s) must be an integer")
      .min(1, "Volume(s) must be a positive number"),
  ]),
  synopsis: z.string(),
  background: z.string(),
})

export type MangaType = z.infer<typeof MangaSchema>

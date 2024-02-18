import {
  AnimeAgeRating,
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from "@prisma/client"
import { z } from "zod"

export const AnimeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  poster: z.union([z.literal(""), z.string().url()]),
  format: z.union([z.literal(""), z.nativeEnum(AnimeFormat)]),
  status: z.union([z.literal(""), z.nativeEnum(AnimeStatus)]),
  episode_count: z.union([
    z.literal(""),
    z.coerce
      .number()
      .int("Episode count must be an integer")
      .min(1, "Episode count must be a positive number"),
  ]),
  season: z.union([z.literal(""), z.nativeEnum(AnimeSeason)]),
  year: z.union([
    z.literal(""),
    z.coerce
      .number()
      .int("Year must be an integer")
      .min(1917, "Year must be 1917 or later"),
  ]),
  source_type: z.union([z.literal(""), z.nativeEnum(AnimeSource)]),
  age_rating: z.union([z.literal(""), z.nativeEnum(AnimeAgeRating)]),
  synopsis: z.string(),
  background: z.string(),
})

export type AnimeType = z.infer<typeof AnimeSchema>

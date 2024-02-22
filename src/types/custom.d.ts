import {
  Anime,
  AnimeCharacter,
  Character,
  Manga,
  MangaCharacter,
} from "@prisma/client"
import { LucideIcon } from "lucide-react"

export type Routes = {
  label: string
  icon: LucideIcon
  href?: string | null | undefined
  active?: boolean | null | undefined
  links?:
    | {
        label: string
        href: string
      }[]
    | null
    | undefined
  admin?: boolean
}[]

export type SearchMode = "anime" | "manga" | "character" | "all"

export type ExtendedAnime = Anime & {
  characters: AnimeCharacter &
    {
      character: Character
    }[]
}

export type ExtendedCharacter = Character & {
  anime: AnimeCharacter &
    {
      anime: Anime
    }[]
  manga: MangaCharacter &
    {
      manga: Manga
    }[]
}

export type SearchResults = {
  anime: Anime[]
  manga: Manga[]
  characters: Character[]
}

export type ErrorResponse = {
  message: string
}

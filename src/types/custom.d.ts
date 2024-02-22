import { Anime, AnimeCharacter, Character } from "@prisma/client"
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

export type SearchMode = "anime" | "manga" | "character"

export type ExtendedAnime = Anime & {
  characters: AnimeCharacter &
    {
      character: Character
    }[]
}

export type ErrorResponse = {
  message: string
}

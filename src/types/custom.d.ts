import {
  Anime,
  AnimeCharacter,
  AnimeList,
  AnimeRating,
  Character,
  CharacterList,
  ListAnime,
  ListCharacter,
  ListManga,
  Manga,
  MangaCharacter,
  MangaList,
  MangaRating,
  User,
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

export type ExtendedUser = User & {
  anime_lists: Array<
    AnimeList & {
      anime: Array<
        ListAnime & {
          anime: Anime
        }
      >
    }
  >
  manga_lists: Array<
    MangaList & {
      manga: Array<
        ListManga & {
          manga: Manga
        }
      >
    }
  >
  character_lists: Array<
    CharacterList & {
      characters: Array<
        ListCharacter & {
          character: Character
        }
      >
    }
  >
  anime_ratings: Array<
    AnimeRating & {
      anime: Anime
    }
  >
  manga_ratings: Array<
    MangaRating & {
      manga: Manga
    }
  >
}

export type ExtendedAnime = Anime & {
  characters: Array<
    AnimeCharacter & {
      character: Character
    }
  >
}

export type ExtendedManga = Manga & {
  characters: Array<
    AnimeCharacter & {
      character: Character
    }
  >
}

export type ExtendedCharacter = Character & {
  anime: Array<
    AnimeCharacter & {
      anime: Anime
    }
  >
  manga: Array<
    MangaCharacter & {
      manga: Manga
    }
  >
}

export type SearchResults = {
  anime: Anime[]
  manga: Manga[]
  characters: Character[]
}

export type ErrorResponse = {
  message: string
}

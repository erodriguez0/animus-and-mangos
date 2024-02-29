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
  anime_lists: AnimeList[] & {
    list_anime: ListAnime[] & {
      anime: Anime
    }
  }
  manga_lists: MangaList[] & {
    list_manga: ListManga[] & {
      manga: Manga
    }
  }
  character_lists: CharacterList[] & {
    list_character: ListCharacter[] & {
      character: Character
    }
  }
  anime_ratings: AnimeRating[] & {
    anime: Anime
  }
  manga_ratings: MangaRating[] & {
    manga: Manga
  }
}

export type ExtendedAnime = Anime & {
  characters: AnimeCharacter &
    {
      character: Character
    }[]
}

export type ExtendedManga = Manga & {
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

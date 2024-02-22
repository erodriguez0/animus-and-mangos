import { prismadb } from "@/lib/db"

import { SearchMode, SearchResults } from "@/types/custom"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get("q")
    const mode = url.searchParams.get("mode")

    if (!query) {
      return Response.json({ message: "Invalid search query" }, { status: 400 })
    }

    let data: SearchResults = {
      anime: [],
      manga: [],
      characters: [],
    }

    if (mode === "anime" || mode === "all") {
      data.anime = await prismadb.anime.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 3,
      })
    } else if (mode === "manga" || mode === "all") {
      data.manga = await prismadb.manga.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 3,
      })
    } else if (mode === "character" || mode === "all") {
      data.characters = await prismadb.character.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 3,
      })
    }

    return Response.json(data)
  } catch (error) {
    console.log("[SEARCH_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

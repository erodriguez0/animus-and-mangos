import { prismadb } from "@/lib/db"

import { SearchResults } from "@/types/custom"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get("q")
    const mode = url.searchParams.get("mode") || "all"
    // const limit = url.searchParams.get("limit")
    //   ? parseInt(url.searchParams.get("limit") as string, 10)
    //   : 3
    const limit = mode === "all" ? 10 : 3
    const page = url.searchParams.get("page")
      ? parseInt(url.searchParams.get("page") as string, 10)
      : 0
    const skip = page * limit

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
        skip: skip,
        take: limit,
      })
    } else if (mode === "manga" || mode === "all") {
      data.manga = await prismadb.manga.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        skip: skip,
        take: limit,
      })
    } else if (mode === "character" || mode === "all") {
      data.characters = await prismadb.character.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        skip: skip,
        take: limit,
      })
    }

    return Response.json(data)
  } catch (error) {
    console.log("[SEARCH_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

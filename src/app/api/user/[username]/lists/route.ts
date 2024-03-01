import { AnimeList, CharacterList, MangaList } from "@prisma/client"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

interface IParams {
  params: {
    username: string
  }
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const session = await getAuthSession()
    const url = new URL(req.url)
    const mode = url.searchParams.get("mode")

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    if (session.user.username !== params.username) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    let lists: (AnimeList | MangaList | CharacterList)[] = []

    if (mode === "anime") {
      lists = await prismadb.animeList.findMany({
        where: {
          user_id: session.user.id,
        },
      })
    }

    if (mode === "manga") {
      lists = await prismadb.mangaList.findMany({
        where: {
          user_id: session.user.id,
        },
      })
    }

    if (mode === "character") {
      lists = await prismadb.characterList.findMany({
        where: {
          user_id: session.user.id,
        },
      })
    }

    return Response.json(lists)
  } catch (error) {
    console.log("[USER_USERNAME_LISTS_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

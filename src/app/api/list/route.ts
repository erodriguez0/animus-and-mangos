import { AnimeList, CharacterList, MangaList } from "@prisma/client"

import { ListSchema, TypesOfLists } from "@/lib/validators/list"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    const body = await req.json()

    const parsed = await ListSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.errors[0].message },
        { status: 400 },
      )
    }

    let list: AnimeList | MangaList | CharacterList

    if (parsed.data.type === TypesOfLists.ANIME) {
      list = await prismadb.animeList.create({
        data: {
          name: parsed.data.name,
          user_id: session.user.id,
        },
      })
    } else if (parsed.data.type === TypesOfLists.MANGA) {
      list = await prismadb.mangaList.create({
        data: {
          name: parsed.data.name,
          user_id: session.user.id,
        },
      })
    } else {
      list = await prismadb.characterList.create({
        data: {
          name: parsed.data.name,
          user_id: session.user.id,
        },
      })
    }

    return Response.json(list)
  } catch (error) {
    console.log("[ANIME_LIST_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

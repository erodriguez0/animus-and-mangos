import { ListAnimeSchema } from "@/lib/validators/list-anime"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 500 })
    }

    const body = await req.json()

    const parsed = await ListAnimeSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid data" }, { status: 400 })
    }

    const { anime_id, list_id } = parsed.data

    const list = await prismadb.animeList.findUnique({
      where: {
        id: list_id,
      },
    })

    if (list?.user_id !== session.user.id) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const listAnime = await prismadb.listAnime.findFirst({
      where: {
        list_id,
        anime_id,
      },
    })

    if (listAnime) {
      await prismadb.listAnime.deleteMany({
        where: {
          list_id,
          anime_id,
        },
      })
    } else {
      await prismadb.listAnime.create({
        data: {
          list_id,
          anime_id,
        },
      })
    }

    return Response.json(listAnime)
  } catch (error) {
    console.log("[LIST_ANIME_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

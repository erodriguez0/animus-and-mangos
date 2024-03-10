import { ListMangaSchema } from "@/lib/validators/list-manga"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 500 })
    }

    const body = await req.json()

    const parsed = await ListMangaSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid data" }, { status: 400 })
    }

    const { manga_id, list_id } = parsed.data

    const list = await prismadb.mangaList.findUnique({
      where: {
        id: list_id,
      },
    })

    if (list?.user_id !== session.user.id) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const listManga = await prismadb.listManga.findFirst({
      where: {
        list_id,
        manga_id,
      },
    })

    if (listManga) {
      await prismadb.listManga.deleteMany({
        where: {
          list_id,
          manga_id,
        },
      })
    } else {
      await prismadb.listManga.create({
        data: {
          list_id,
          manga_id,
        },
      })
    }

    return Response.json(listManga)
  } catch (error) {
    console.log("[LIST_MANGA_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { UserRole } from "@prisma/client"

import { MangaSchema } from "@/lib/validators/manga"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

interface IParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const manga = await prismadb.manga.findUnique({
      where: {
        id: params.id,
      },
      include: {
        characters: {
          include: {
            character: true,
          },
        },
      },
    })

    if (!manga) {
      return Response.json({ message: "Manga not found" }, { status: 404 })
    }

    return Response.json(manga)
  } catch (error) {
    console.log("[MANGA_ID_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: IParams) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const mangaExists = await prismadb.manga.findUnique({
      where: {
        id: params.id,
      },
      include: {
        characters: true,
      },
    })

    if (!mangaExists) {
      return Response.json({ message: "Manga not found" }, { status: 404 })
    }

    const body = await req.json()

    const parsed = await MangaSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid manga data" }, { status: 400 })
    }

    const { data } = parsed

    const manga = await prismadb.manga.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        poster: data.poster,
        format: data.format || null,
        status: data.status || null,
        volumes: data.volumes || null,
        chapters: data.chapters || null,
        synopsis: data.synopsis,
        background: data.background,
      },
    })

    // Differentiate between added/deleted manga characters
    const mangaCharacters = mangaExists.characters.map(
      item => item.character_id,
    )
    const charactersToDelete = mangaCharacters.filter(
      item => !data.characters.includes(item),
    )
    const charactersToCreate = data.characters.filter(
      item => !mangaCharacters.includes(item),
    )

    if (charactersToDelete.length) {
      await prismadb.mangaCharacter.deleteMany({
        where: {
          character_id: {
            in: charactersToDelete,
          },
          manga_id: params.id,
        },
      })
    }

    if (charactersToCreate.length) {
      await prismadb.mangaCharacter.createMany({
        data: charactersToCreate.map(item => {
          return {
            manga_id: params.id,
            character_id: item,
          }
        }),
      })
    }

    return Response.json(manga)
  } catch (error) {
    console.log("[MANGA_ID_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

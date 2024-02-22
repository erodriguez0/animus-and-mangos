import { UserRole } from "@prisma/client"

import { AnimeSchema } from "@/lib/validators/anime"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

interface IParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const anime = await prismadb.anime.findUnique({
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

    if (!anime) {
      return Response.json({ message: "Anime not found" }, { status: 404 })
    }

    return Response.json(anime)
  } catch (error) {
    console.log("[ANIME_ID_GET]\n", error)

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

    const animeExists = await prismadb.anime.findUnique({
      where: {
        id: params.id,
      },
      include: {
        characters: true,
      },
    })

    if (!animeExists) {
      return Response.json({ message: "Anime not found" }, { status: 404 })
    }

    const body = await req.json()

    const parsed = await AnimeSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid anime data" }, { status: 400 })
    }

    const { data } = parsed

    const anime = await prismadb.anime.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        poster: data.poster,
        format: data.format || null,
        status: data.status || null,
        episode_count: data.episode_count || null,
        season: data.season || null,
        year: data.year || null,
        source_type: data.source_type || null,
        age_rating: data.age_rating || null,
        synopsis: data.synopsis,
        background: data.background,
      },
    })

    // Differentiate between added/deleted anime characters
    const animeCharacters = animeExists.characters.map(
      item => item.character_id,
    )
    const charactersToDelete = animeCharacters.filter(
      item => !data.characters.includes(item),
    )
    const charactersToCreate = data.characters.filter(
      item => !animeCharacters.includes(item),
    )

    if (charactersToDelete.length) {
      await prismadb.animeCharacter.deleteMany({
        where: {
          character_id: {
            in: charactersToDelete,
          },
          anime_id: params.id,
        },
      })
    }

    if (charactersToCreate.length) {
      await prismadb.animeCharacter.createMany({
        data: charactersToCreate.map(item => {
          return {
            anime_id: params.id,
            character_id: item,
          }
        }),
      })
    }

    return Response.json(anime)
  } catch (error) {
    console.log("[ANIME_ID_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

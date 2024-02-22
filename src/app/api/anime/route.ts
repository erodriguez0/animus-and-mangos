import { UserRole } from "@prisma/client"

import { AnimeSchema } from "@/lib/validators/anime"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const anime = await prismadb.anime.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    })

    return Response.json(anime)
  } catch (error) {
    console.log("[ANIME_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const parsed = await AnimeSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid anime data" }, { status: 400 })
    }

    const { data } = parsed

    const anime = await prismadb.anime.create({
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

    // Create AnimeCharacter relation if they exist
    if (data.characters.length) {
      for (const characterId of data.characters) {
        const characterExists = await prismadb.character.findUnique({
          where: {
            id: characterId,
          },
        })

        if (!characterExists) {
          continue
        }

        await prismadb.animeCharacter.create({
          data: {
            anime_id: anime.id,
            character_id: characterId,
          },
        })
      }
    }

    return Response.json(anime, { status: 201 })
  } catch (error) {
    console.log("[ANIME_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

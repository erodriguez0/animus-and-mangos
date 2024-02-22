import { UserRole } from "@prisma/client"

import { CharacterSchema } from "@/lib/validators/character"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const characters = await prismadb.character.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    })

    return Response.json(characters)
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

    const parsed = await CharacterSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid anime data" }, { status: 400 })
    }

    const { data } = parsed

    const character = await prismadb.character.create({
      data: {
        name: data.name,
        image: data.image,
        bio: data.bio,
        gender: data.gender || null,
      },
    })

    // Create AnimeCharacter relation if anime exists
    if (data.anime.length) {
      for (const animeId of data.anime) {
        const animeExists = await prismadb.anime.findUnique({
          where: {
            id: animeId,
          },
        })

        if (!animeExists) {
          continue
        }

        await prismadb.animeCharacter.create({
          data: {
            anime_id: animeId,
            character_id: character.id,
          },
        })
      }
    }

    // Create MangaCharacter relation if manga exists
    if (data.manga.length) {
      for (const mangaId of data.manga) {
        const mangaExists = await prismadb.manga.findUnique({
          where: {
            id: mangaId,
          },
        })

        if (!mangaExists) {
          continue
        }

        await prismadb.mangaCharacter.create({
          data: {
            manga_id: mangaId,
            character_id: character.id,
          },
        })
      }
    }

    return Response.json(character, { status: 201 })
  } catch (error) {
    console.log("[ANIME_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

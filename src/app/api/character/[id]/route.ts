import { UserRole } from "@prisma/client"

import { CharacterSchema } from "@/lib/validators/character"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

interface IParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const character = await prismadb.character.findUnique({
      where: {
        id: params.id,
      },
      include: {
        anime: {
          include: {
            anime: true,
          },
        },
        manga: {
          include: {
            manga: true,
          },
        },
      },
    })

    if (!character) {
      return Response.json({ message: "Character not found" }, { status: 404 })
    }

    return Response.json(character)
  } catch (error) {
    console.log("[CHARACTER_ID_GET]\n", error)

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

    const body = await req.json()

    const parsed = await CharacterSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid anime data" }, { status: 400 })
    }

    const { data } = parsed

    const characterExists = await prismadb.character.findUnique({
      where: {
        id: params.id,
      },
      include: {
        anime: true,
        manga: true,
      },
    })

    if (!characterExists) {
      return Response.json({ message: "Character not found" }, { status: 404 })
    }

    const character = await prismadb.character.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        image: data.image,
        bio: data.bio,
        gender: data.gender || null,
      },
    })

    // Differentiate between added/deleted anime and manga
    const animeCharacters = characterExists.anime.map(item => item.anime_id)
    const mangaCharacters = characterExists.manga.map(item => item.manga_id)
    const animeToDelete = animeCharacters.filter(
      item => !data.anime.includes(item),
    )
    const mangaToDelete = mangaCharacters.filter(
      item => !data.manga.includes(item),
    )
    const animeToCreate = data.anime.filter(
      item => !animeCharacters.includes(item),
    )
    const mangaToCreate = data.manga.filter(
      item => !mangaCharacters.includes(item),
    )

    if (animeToDelete.length) {
      await prismadb.animeCharacter.deleteMany({
        where: {
          anime_id: {
            in: animeToDelete,
          },
          character_id: params.id,
        },
      })
    }

    if (mangaToDelete.length) {
      await prismadb.mangaCharacter.deleteMany({
        where: {
          manga_id: {
            in: mangaToDelete,
          },
          character_id: params.id,
        },
      })
    }

    if (animeToCreate.length) {
      await prismadb.animeCharacter.createMany({
        data: animeToCreate.map(item => {
          return {
            anime_id: item,
            character_id: params.id,
          }
        }),
      })
    }

    if (mangaToCreate.length) {
      await prismadb.mangaCharacter.createMany({
        data: mangaToCreate.map(item => {
          return {
            manga_id: item,
            character_id: params.id,
          }
        }),
      })
    }

    return Response.json(character)
  } catch (error) {
    console.log("[CHARACTER_ID_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

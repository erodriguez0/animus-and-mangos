import { UserRole } from "@prisma/client"

import { MangaSchema } from "@/lib/validators/manga"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const manga = await prismadb.manga.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    })

    return Response.json(manga)
  } catch (error) {
    console.log("[MANGA_GET]\n", error)

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

    const parsed = await MangaSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid manga data" }, { status: 400 })
    }

    const { data } = parsed

    const manga = await prismadb.manga.create({
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

    // Create MangaCharacter relation if they exist
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

        await prismadb.mangaCharacter.create({
          data: {
            manga_id: manga.id,
            character_id: characterId,
          },
        })
      }
    }

    return Response.json(manga, { status: 201 })
  } catch (error) {
    console.log("[MANGA_POST]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

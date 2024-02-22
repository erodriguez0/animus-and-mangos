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

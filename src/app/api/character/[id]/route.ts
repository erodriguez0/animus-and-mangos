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

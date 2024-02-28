import { prismadb } from "@/lib/db"

interface IParams {
  params: {
    username: string
  }
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const { username } = params

    const user = await prismadb.user.findUnique({
      where: {
        username,
      },
      include: {
        anime_lists: {
          include: {
            anime: {
              include: {
                anime: true,
              },
              take: 10,
            },
          },
        },
        manga_lists: {
          include: {
            manga: {
              include: {
                manga: true,
              },
              take: 10,
            },
          },
        },
        character_lists: {
          include: {
            characters: {
              include: {
                character: true,
              },
              take: 10,
            },
          },
        },
        anime_ratings: {
          include: {
            anime: true,
          },
          take: 10,
        },
        manga_ratings: {
          include: {
            manga: true,
          },
          take: 10,
        },
      },
    })

    if (!user) {
      return Response.json({ message: "User does not exist" }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    console.log("[USER_USERNAME_GET]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

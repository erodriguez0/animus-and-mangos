import { UsernameSchema } from "@/lib/validators/username"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    const body = await req.json()

    const parsed = await UsernameSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid username data" },
        { status: 400 },
      )
    }

    const usernameExists = await prismadb.user.findFirst({
      where: {
        username: {
          equals: parsed.data.username,
          mode: "insensitive",
        },
      },
    })

    if (usernameExists) {
      return Response.json(
        { message: "Username already taken" },
        { status: 409 },
      )
    }

    const user = await prismadb.user.update({
      data: {
        username: parsed.data.username,
      },
      where: {
        id: session.user.id,
      },
    })

    return Response.json(user)
  } catch (error) {
    console.log("[SETTINGS_AVATAR]\n", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

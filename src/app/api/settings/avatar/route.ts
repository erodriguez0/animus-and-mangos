import { AvatarSchema } from "@/lib/validators/avatar"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    const body = await req.json()

    const parsed = await AvatarSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json({ message: "Invalid avatar data" }, { status: 400 })
    }

    const user = await prismadb.user.update({
      data: {
        avatar: parsed.data.avatar,
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

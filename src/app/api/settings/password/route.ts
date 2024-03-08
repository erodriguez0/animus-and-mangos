import bcrypt from "bcrypt"

import { PasswordSchema } from "@/lib/validators/password"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return Response.json({ message: "Unauthenticated" }, { status: 401 })
    }

    const body = await req.json()

    const parsed = await PasswordSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid password data" },
        { status: 400 },
      )
    }

    const userExists = await prismadb.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!userExists) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const isPasswordCorrect = await bcrypt.compare(
      parsed.data.current,
      userExists.password,
    )

    if (!isPasswordCorrect) {
      return Response.json(
        { message: "Incorrect current password" },
        { status: 401 },
      )
    }

    const hash = await bcrypt.hash(parsed.data.password, 10)

    const user = await prismadb.user.update({
      data: {
        password: hash,
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

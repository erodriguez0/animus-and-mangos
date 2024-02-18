import bcrypt from "bcrypt"

import { prismadb } from "@/lib/db"
import { LoginSchema } from "@/lib/validators/login"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = await LoginSchema.safeParseAsync(body)

    if (!parsed.success) {
      return new Response("Invalid login data", { status: 400 })
    }

    const { identifier, password } = parsed.data

    const user = await prismadb.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: identifier,
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: identifier,
              mode: "insensitive",
            },
          },
        ],
      },
    })

    if (!user) {
      return new Response("Invalid credentials", { status: 401 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return new Response("Invalid credentials", { status: 401 })
    }

    return Response.json(user, { status: 200 })
  } catch (error) {
    console.log("[AUTH_LOGIN]", error)

    return new Response("Internal server error", { status: 500 })
  }
}

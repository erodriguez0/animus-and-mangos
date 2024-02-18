import bcrypt from "bcrypt"
import { nanoid } from "nanoid"

import { prismadb } from "@/lib/db"
import { RegisterSchema } from "@/lib/validators/register"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = await RegisterSchema.safeParseAsync(body)

    if (!parsed.success) {
      return new Response("Invalid registration data", { status: 400 })
    }

    const { email, password } = parsed.data

    const userExists = await prismadb.user.findFirst({
      where: {
        email: {
          startsWith: email,
          mode: "insensitive",
        },
      },
    })

    if (userExists) {
      return new Response("Email already in use", { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prismadb.user.create({
      data: {
        email,
        username: "user" + nanoid(10),
        password: hash,
      },
    })

    return Response.json(user, { status: 200 })
  } catch (error) {
    console.log("[AUTH_REGISTER]", error)

    return new Response("Internal server error", { status: 500 })
  }
}

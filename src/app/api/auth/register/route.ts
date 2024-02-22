import bcrypt from "bcrypt"
import { nanoid } from "nanoid"

import { RegisterSchema } from "@/lib/validators/register"

import { prismadb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = await RegisterSchema.safeParseAsync(body)

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid registration data" },
        { status: 400 },
      )
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
      return Response.json({ message: "Email already in use" }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prismadb.user.create({
      data: {
        email,
        username: "user" + nanoid(10),
        password: hash,
      },
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    console.log("[AUTH_REGISTER]", error)

    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

"use server"

import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

import { RegisterSchema, RegisterType } from "@/lib/validators/register"

import { prismadb } from "@/lib/db"

const createUser = async (data: RegisterType) => {
  let user: User | null

  try {
    const parsed = await RegisterSchema.safeParseAsync(data)

    if (!parsed.success) {
      return
      //   return new Response("Invalid registration data", { status: 400 })
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
      return
      //   return new Response("Email already in use", { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)
    user = await prismadb.user.create({
      data: {
        email,
        username: "user" + nanoid(10),
        password: hash,
      },
    })
  } catch (error) {}

  revalidatePath("/")
  return
}

export { createUser }

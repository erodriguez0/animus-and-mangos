"use server"

import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

import { RegisterSchema, RegisterType } from "@/lib/validators/register"

import { prismadb } from "@/lib/db"

import { State } from "@/types/custom"

const createUser = async (state: State, data: RegisterType) => {
  try {
    const { email, password } = await RegisterSchema.parseAsync(data)

    const userExists = await prismadb.user.findFirst({
      where: {
        email,
      },
    })

    if (userExists) {
      return {
        message: "Email already in use",
      }
    }

    const hash = await bcrypt.hash(password, 10)
    await prismadb.user.create({
      data: {
        email,
        username: "user" + nanoid(10),
        password: hash,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors[0].message,
      }
    }

    return {
      message: "Something went wrong",
    }
  }

  redirect("/login")
}

export { createUser }

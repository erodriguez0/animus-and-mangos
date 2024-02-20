import bcrypt from "bcryptjs"
import { signIn } from "next-auth/react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

import { LoginSchema, LoginType } from "@/lib/validators/login"

import { State } from "@/types/custom"

export const loginUser = async (state: State, data: LoginType) => {
  try {
    const { identifier, password } = await LoginSchema.parseAsync(data)

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    })

    if (!res) {
      return {
        message: "Invalid credentials",
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors[0].message,
      }
    }

    // if (error instanceof AuthError) {
    //   return {
    //     message: "Invalid credentials",
    //   }
    // }

    return {
      message: "Something went wrong",
    }
  }

  redirect("/")
}

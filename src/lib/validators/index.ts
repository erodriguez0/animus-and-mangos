import { z } from "zod"

export const email = z.string().email("Invalid email address")

export const username = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username cannot exceed 20 characters")
  .regex(/[\w-]+$/, "Username must be letters, numbers, or underscores")

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")

import { UserRole } from "@prisma/client"
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    username: string
    avatar?: string | null
    role: UserRole
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      avatar?: string | null
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    username: string
    avatar?: string | null
    role: UserRole
  }
}

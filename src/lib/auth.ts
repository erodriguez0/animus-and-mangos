import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prismadb } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: "jwt",
    maxAge: 2592000,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email/Username + Password",
      credentials: {
        identifier: { type: "text", label: "Email or Username" },
        password: { type: "password", label: "Password" },
      },
      authorize: async (credentials, req) => {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "post",
              body: JSON.stringify(credentials),
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          if (!res.ok) {
            return null
          }

          const user = await res.json()

          if (!user) {
            return null
          }

          return user
        } catch (error) {
          console.log("[NEXTAUTH_AUTHORIZE]", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ token, session }) => {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.username = token.username
        session.user.avatar = token.avatar
        session.user.role = token.role
      }

      return session
    },
    jwt: async ({ token, user }) => {
      const dbUser = await prismadb.user.findFirst({
        where: {
          email: {
            equals: token.email,
            mode: "insensitive",
          },
        },
      })

      if (!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        avatar: dbUser.avatar,
        role: dbUser.role,
      }
    },
    redirect: ({ baseUrl }) => {
      return baseUrl
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

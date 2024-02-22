import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
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
          if (!credentials?.identifier || !credentials.password) {
            return null
          }

          const user = await prismadb.user.findFirst({
            where: {
              OR: [
                {
                  email: {
                    equals: credentials.identifier,
                    mode: "insensitive",
                  },
                },
                {
                  username: {
                    equals: credentials.identifier,
                    mode: "insensitive",
                  },
                },
              ],
            },
          })

          if (!user) {
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          )

          if (!isPasswordCorrect) {
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

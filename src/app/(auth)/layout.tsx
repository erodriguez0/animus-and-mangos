import { redirect } from "next/navigation"
import { ReactNode } from "react"

import { getAuthSession } from "@/lib/auth"

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await getAuthSession()

  if (session) {
    redirect("/")
  }

  return <>{children}</>
}

export default AuthLayout

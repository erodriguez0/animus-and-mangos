import { notFound } from "next/navigation"
import { ReactNode } from "react"

import Sidebar from "@/components/ui/sidebar"

import SiteHeader from "@/components/site/site-header"

import { ExtendedUser } from "@/types/custom"

interface UserProfileLayoutProps {
  children: ReactNode
  params: {
    username: string
  }
}

const UserProfileLayout = async ({
  children,
  params,
}: UserProfileLayoutProps) => {
  const res = await fetch(`${process.env.API_URL}/api/user/${params.username}`)

  if (!res.ok) {
    notFound()
  }

  const user: ExtendedUser = await res.json()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] gap-2 lg:min-h-[calc(100vh-5rem)] lg:px-2 xl:gap-4 xl:px-0">
        <Sidebar className="static h-full min-h-[calc(100vh-5rem)] gap-4 bg-secondary">
          <>{params.username}</>
        </Sidebar>

        <div className="flex flex-1 flex-col gap-4 overflow-x-hidden">
          {children}
          {/* Bottom padding to maintain py-0 on parent */}
          <div />
        </div>
      </main>
    </div>
  )
}

export default UserProfileLayout

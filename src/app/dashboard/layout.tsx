import { UserRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ThemeToggle from "@/components/theme-toggle"

import { getAuthSession } from "@/lib/auth"

export const revalidate = 0

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getAuthSession()

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] gap-2 px-2 lg:min-h-[calc(100vh-5rem)] xl:gap-4 xl:px-0">
        <DashboardSidebar />
        <div className="relative flex flex-1 flex-col py-4">
          <div className="absolute right-0 top-4 hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-4 lg:gap-y-8">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

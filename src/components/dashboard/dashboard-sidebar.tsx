import { UserIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import Sidebar from "@/components/ui/sidebar"

import DashboardMenu from "@/components/dashboard/dashboard-menu"

import LogoutButton from "@/components/logout-button"
import ThemeToggle from "@/components/theme-toggle"

import { getAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const DashboardSidebar = async () => {
  const session = await getAuthSession()

  return (
    <Sidebar className="border-x py-4">
      <Link
        href="/dashboard"
        className="px-4"
      >
        <Logo />
      </Link>

      <ScrollArea
        type="always"
        className="flex flex-1 flex-col px-4"
      >
        <DashboardMenu />
      </ScrollArea>

      <div className="flex gap-2 px-4">
        {session?.user ? (
          <Link
            href={`/u/${session.user.username}`}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            <UserIcon className="h-4 w-4" />
          </Link>
        ) : (
          <Link href="/login"></Link>
        )}

        <ThemeToggle />

        <LogoutButton />
      </div>
    </Sidebar>
  )
}

export default DashboardSidebar

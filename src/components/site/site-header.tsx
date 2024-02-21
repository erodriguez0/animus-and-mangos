import { UserRole } from "@prisma/client"
import { BookIcon, LayoutDashboardIcon, TvIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import Header from "@/components/ui/header"
import Logo from "@/components/ui/logo"

import LogoutButton from "@/components/logout-button"
import SiteDrawer from "@/components/site/site-drawer"
import ThemeToggle from "@/components/theme-toggle"

import { getAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const SiteHeader = async () => {
  const session = await getAuthSession()

  return (
    <Header>
      <div className="flex h-full items-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="ml-auto flex h-full items-center justify-end">
        {/* Desktop */}
        <div className="hidden gap-2 lg:flex">
          {!session && (
            <>
              <Link
                href="/register"
                className={cn(buttonVariants())}
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Login
              </Link>
            </>
          )}

          {session && (
            <>
              {session.user.role === UserRole.ADMIN && (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ size: "icon", variant: "outline" }),
                    "shrink-0",
                  )}
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                </Link>
              )}

              <Link
                href={`/user/${session.user.username}/anime`}
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" }),
                  "shrink-0",
                )}
              >
                <TvIcon className="h-4 w-4" />
              </Link>

              <Link
                href={`/user/${session.user.username}/manga`}
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" }),
                  "shrink-0",
                )}
              >
                <BookIcon className="h-4 w-4" />
              </Link>

              <ThemeToggle />

              <LogoutButton />
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden">
          <SiteDrawer />
        </div>
      </div>
    </Header>
  )
}

export default SiteHeader

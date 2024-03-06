import { UserRole } from "@prisma/client"
import { format } from "date-fns"
import { SettingsIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ReactNode } from "react"

import Avatar from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import Sidebar from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

import SiteHeader from "@/components/site/site-header"

import { getAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

import { ExtendedUser } from "@/types/custom"

export const revalidate = 0

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
  const session = await getAuthSession()

  const res = await fetch(`${process.env.API_URL}/user/${params.username}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    notFound()
  }

  const user: ExtendedUser = await res.json()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-2 lg:min-h-[calc(100vh-5rem)] lg:flex-row lg:px-2 xl:gap-4 xl:px-0">
        <Sidebar className="static flex h-fit w-full gap-4 lg:h-full lg:min-h-[calc(100vh-5rem)] lg:w-64">
          <>
            <Avatar
              src={user.avatar}
              iconSize={24}
              className="mx-auto max-w-64"
            />

            <div className="flex flex-col items-center gap-2">
              <p
                className="mx-auto line-clamp-1 break-all text-xl font-bold tracking-tight"
                title={user.username}
              >
                {user.username}
              </p>

              {(user.role === UserRole.ADMIN ||
                user.role === UserRole.MOD ||
                user.role === UserRole.OWNER) && (
                <div
                  className={cn(
                    "w-fit rounded-md px-2 py-0.5 text-xs text-white",
                    user.role === UserRole.ADMIN && "bg-red-600",
                    user.role === UserRole.MOD && "bg-green-600",
                    user.role === UserRole.OWNER && "bg-amber-500",
                  )}
                >
                  {user.role}
                </div>
              )}
            </div>

            <div className="px-4 lg:px-0">
              {session?.user.username === params.username && (
                <Link
                  href={`/u/${params.username}/settings`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full gap-2 lg:justify-start",
                  )}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
              )}
            </div>

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Joined</TableCell>
                  <TableCell className="flex justify-end">
                    {format(user.created_at, "PP")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
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

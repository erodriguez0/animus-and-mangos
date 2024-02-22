"use client"

import { MenuIcon, UserIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import Logo from "@/components/ui/logo"
import { ScrollArea } from "@/components/ui/scroll-area"

import LogoutButton from "@/components/logout-button"
import SiteMenu from "@/components/site/site-menu"
import ThemeToggle from "@/components/theme-toggle"

import { cn } from "@/lib/utils"

const SiteDrawer = () => {
  const { data: session } = useSession()
  const [open, setOpen] = useState<boolean>()

  const onClose = (width: number) => {
    if (width >= 1024) {
      setOpen(false)
    }
  }

  useEffect(() => {
    onClose(window.innerWidth)

    window.addEventListener("resize", () => onClose(window.innerWidth))

    return () => {
      window.removeEventListener("resize", () => onClose(window.innerWidth))
    }
  })

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction="right"
    >
      <DrawerTrigger>
        <div
          className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
        >
          <MenuIcon className="h-4 w-4" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <Logo />
        </div>

        <ScrollArea
          type="always"
          className="flex flex-1 flex-col gap-4 px-4"
        >
          <SiteMenu onClick={() => setOpen(false)} />
        </ScrollArea>
        <div className="flex gap-2 p-4">
          {session?.user ? (
            <Link
              href={`/user/${session.user.username}`}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              <UserIcon className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants(), "flex-1")}
            >
              Login
            </Link>
          )}

          <ThemeToggle />

          <LogoutButton />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default SiteDrawer

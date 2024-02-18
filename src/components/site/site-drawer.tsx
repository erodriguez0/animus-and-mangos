"use client"

import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import Logo from "@/components/ui/logo"
import { ScrollArea } from "@/components/ui/scroll-area"

import SiteMenu from "@/components/site/site-menu"
import ThemeToggle from "@/components/theme-toggle"

// import UserBadgeClient from "@/components/user-badge-client"
import { cn } from "@/lib/utils"

const SiteDrawer = () => {
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
          <SiteMenu />
        </ScrollArea>
        <div className="flex gap-2 p-4">
          {/* <UserBadgeClient sidebar /> */}
          <ThemeToggle />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default SiteDrawer

"use client"

import {
  ClapperboardIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MicIcon,
  SettingsIcon,
  SquareUserIcon,
  TvIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { Routes } from "@/types/custom"

const useSiteRoutes = () => {
  const pathname = usePathname()

  const routes: Routes = [
    {
      label: "Home",
      icon: LayoutDashboardIcon,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Anime",
      icon: TvIcon,
      links: [],
    },
    {
      label: "Manga",
      icon: LibraryIcon,
      links: [],
    },
    {
      label: "Characters",
      icon: SquareUserIcon,
      links: [],
    },
    {
      label: "Actors",
      icon: MicIcon,
      links: [],
    },
    {
      label: "Staff",
      icon: ClapperboardIcon,
      links: [],
    },
    {
      label: "Settings",
      icon: SettingsIcon,
      href: "/dashboard/settings",
    },
    {
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dashboard",
      admin: true,
    },
  ]

  return routes
}

export default useSiteRoutes

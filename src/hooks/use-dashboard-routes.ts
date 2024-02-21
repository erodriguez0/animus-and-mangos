"use client"

import {
  CheckIcon,
  ClapperboardIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MicIcon,
  SettingsIcon,
  SquareUserIcon,
  TvIcon,
  UsersIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { Routes } from "@/types/custom"

const useDashboardRoutes = () => {
  const pathname = usePathname()

  const routes: Routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Anime",
      icon: TvIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/anime",
        },
        {
          label: "Add Anime",
          href: "/dashboard/anime/add",
        },
      ],
    },
    {
      label: "Manga",
      icon: LibraryIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/manga",
        },
        {
          label: "Add Manga",
          href: "/dashboard/manga/add",
        },
      ],
    },
    {
      label: "Characters",
      icon: SquareUserIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/character",
        },
        {
          label: "Add Character",
          href: "/dashboard/character/add",
        },
      ],
    },
    {
      label: "Actors",
      icon: MicIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/actors",
        },
        {
          label: "Add Actor",
          href: "/dashboard/actors/add",
        },
      ],
    },
    {
      label: "Staff",
      icon: ClapperboardIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/staff",
        },
        {
          label: "Add Staff",
          href: "/dashboard/staff/add",
        },
      ],
    },
    {
      label: "Users",
      icon: UsersIcon,
      links: [
        {
          label: "Members",
          href: "/dashboard/users",
        },
        {
          label: "Messages",
          href: "/dashboard/users/messages",
        },
        {
          label: "Add User",
          href: "/dashboard/users/add",
        },
      ],
    },
    {
      label: "Submissions",
      icon: CheckIcon,
      links: [
        {
          label: "Overview",
          href: "/dashboard/subnmissions",
        },
        {
          label: "Ratings",
          href: "/dashboard/submissions/ratings",
        },
        {
          label: "Reports",
          href: "/dashboard/submissions/reports",
        },
        {
          label: "Suggestions",
          href: "/dashboard/submissions/suggestions",
        },
      ],
    },
    {
      label: "Settings",
      icon: SettingsIcon,
      href: "/dashboard/settings",
    },
    {
      label: "Main Site",
      icon: ExternalLinkIcon,
      href: "/",
    },
  ]

  return routes
}

export default useDashboardRoutes

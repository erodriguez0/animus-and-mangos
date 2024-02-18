"use client"

import { ArrowRightIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import useSiteRoutes from "@/hooks/use-site-route"

interface SiteMenuProps {
  onClick?: (state: boolean) => void
}

const SiteMenu = ({ onClick }: SiteMenuProps) => {
  const { data: session } = useSession()

  const routes = useSiteRoutes()

  const handleClick = () => {
    if (onClick) {
      onClick(false)
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      //   type="multiple"
      //   defaultValue={routes.map(route => route.label)}
    >
      {routes.map(route => {
        const { label, icon: Icon, href, active, links, admin } = route

        if (admin && session?.user.role !== "ADMIN") return

        if (href) {
          return (
            <Link
              key={href}
              href={href}
              onClick={handleClick}
              className="flex flex-1 items-center justify-between border-b py-2 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </div>

              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )
        }

        return (
          <AccordionItem
            key={label}
            value={label}
          >
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-4">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {links!.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClick}
                  className="border-t py-1 pl-4 text-sm hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default SiteMenu

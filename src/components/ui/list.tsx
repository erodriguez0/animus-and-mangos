"use client"

import { Anime, Manga } from "@prisma/client"
import { ChevronDownIcon, EditIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import Poster from "@/components/ui/poster"

import { cn } from "@/lib/utils"

interface ListProps {
  title?: string
  type: "anime" | "manga"
  items: (Anime | Manga)[]
}

const List = ({ title, type, items }: ListProps) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4">
        <div className="flex h-10 w-full items-center justify-between rounded-md bg-secondary px-2 text-secondary-foreground lg:px-4">
          <div>
            <h4 className="line-clamp-1 break-all font-semibold">{title}</h4>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
          >
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 transition-transform",
                !open && "-rotate-90",
              )}
            />
          </Button>
        </div>

        {items.length > 0 && (
          <div className={cn("flex flex-col gap-2", !open && "hidden")}>
            {items.map(item => (
              <div
                key={item.id}
                className="flex w-full rounded-md bg-secondary/25 dark:bg-secondary/50"
              >
                <Link
                  href={`/${type}/${item.id}`}
                  className="h-20"
                >
                  <Poster
                    src={item?.poster || ""}
                    iconSize={4}
                    className="h-full w-auto"
                  />
                </Link>

                <Link
                  href={`/${type}/${item.id}`}
                  className="flex h-20 w-full flex-wrap p-2"
                >
                  <div>
                    <p className="line-clamp-3 break-all text-sm">
                      {item?.title}
                    </p>
                  </div>
                </Link>

                <Link
                  href={`/dashboard/${type}/${item.id}`}
                  className={cn(
                    buttonVariants({ size: "icon", variant: "secondary" }),
                    "ml-auto h-20 shrink-0",
                  )}
                >
                  <EditIcon className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default List

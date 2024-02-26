import { Anime, Character, Manga } from "@prisma/client"
import Link from "next/link"

import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

import Poster from "./poster"

interface ScrollListProps {
  items: (Anime | Manga)[]
  type?: "anime" | "manga"
  size?: "default" | "sm" | "lg"
  className?: string
}

const ScrollList = ({
  items,
  type = "anime",
  size = "default",
  className,
}: ScrollListProps) => {
  const sizes = {
    default: "h-44 md:h-48 lg:h-52 xl:h-56",
    sm: "h-40 md:h-44 lg:h-48 xl:h-52",
    lg: "h-48 md:h-52 lg:h-56 xl:h-60",
  }

  return (
    <ScrollArea
      type="always"
      orientation="horizontal"
      className={cn("w-full grow-0 pb-4", className)}
    >
      <div className={cn("flex gap-2", sizes[size])}>
        {items.map(item => (
          <Link
            key={item.id}
            href={`/${type}/${item.id}`}
          >
            <Poster
              key={item.id}
              src={item.poster}
              iconSize={6}
              className="h-full w-auto"
            />
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ScrollList

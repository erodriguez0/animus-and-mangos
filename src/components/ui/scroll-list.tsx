import { Anime, Character, Manga } from "@prisma/client"
import Link from "next/link"

import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

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
    default: {
      height: "h-44 md:h-48 lg:h-52 xl:h-56",
      width: "w-36 md:w-40 lg:w-44 xl:w-48",
    },
    sm: {
      height: "h-40 md:h-44 lg:h-48 xl:h-52",
      width: "w-32 md:w-36 lg:w-40 xl:w-44",
    },
    lg: {
      height: "h-48 md:h-52 lg:h-56 xl:h-60",
      width: "w-40 md:w-44 lg:w-48 xl:w-52",
    },
  }

  return (
    <ScrollArea
      type="always"
      orientation="horizontal"
      className={cn("w-full grow-0 pb-4", className)}
    >
      <div className="flex gap-4">
        {items.map(item => (
          <Link
            key={item.id}
            href={`/${type}/${item.id}`}
            title={item.title}
            className={cn("flex flex-col gap-2", sizes[size].width)}
          >
            <Poster
              key={item.id}
              src={item.poster}
              iconSize={6}
              className="h-full"
            />

            <span className="line-clamp-1 text-sm">{item.title}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ScrollList

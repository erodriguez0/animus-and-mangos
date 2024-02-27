import { Character } from "@prisma/client"
import Link from "next/link"

import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

interface CharacterScrollListProps {
  characters: Character[]
  size?: "default" | "sm" | "lg"
}

const CharacterScrollList = ({
  characters,
  size = "default",
}: CharacterScrollListProps) => {
  const sizes = {
    default: {
      height: "h-36 md:h-40 lg:h-44 xl:h-48",
      width: "w-36 md:w-40 lg:w-44 xl:w-48",
    },
    sm: {
      height: "h-32 md:h-36 lg:h-40 xl:h-44",
      width: "h-32 md:h-36 lg:h-40 xl:h-44",
    },
    lg: {
      height: "h-40 md:h-44 lg:h-48 xl:h-52",
      width: "h-40 md:h-44 lg:h-48 xl:h-52",
    },
  }

  return (
    <ScrollArea
      type="always"
      orientation="horizontal"
      className="w-full grow-0 pb-4"
    >
      <div className="flex gap-2">
        {characters.map(c => (
          <Link
            key={c.id}
            href={`/character/${c.id}`}
            className={cn("flex flex-col gap-2", sizes[size].width)}
          >
            <Poster
              key={c.id}
              src={c.image}
              aspect="square"
              iconSize={6}
              className={cn("w-auto", sizes[size].height)}
            />

            <span className="line-clamp-1 text-sm">{c.name}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}

export default CharacterScrollList

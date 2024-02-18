import { TvIcon } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface PosterProps {
  src?: string | null
  aspect?: "auto" | "square" | "video" | "anime"
  iconSize?: number
  className?: string
}

const Poster = ({
  src = "",
  aspect = "anime",
  iconSize = 12,
  className,
}: PosterProps) => {
  const aspects = {
    auto: "aspect-auto",
    square: "aspect-square",
    video: "aspect-video",
    anime: "aspect-[225/325]",
  }

  return (
    <div
      className={cn(
        `relative flex ${[aspects[aspect]]} h-auto w-full items-center justify-center rounded-md bg-muted`,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          className="aspect-[225/325] h-auto w-full rounded-md object-cover"
        />
      ) : (
        <TvIcon
          className={`h-${iconSize} w-${iconSize} stroke-[3] text-muted-foreground`}
        />
      )}
    </div>
  )
}

export default Poster

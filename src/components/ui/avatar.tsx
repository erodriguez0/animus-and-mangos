import { UserIcon } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string | null
  iconSize?: number
  className?: string
}

const Avatar = ({ src, iconSize = 4, className }: AvatarProps) => {
  return (
    <div
      className={cn(
        `relative flex aspect-square h-auto w-full items-center justify-center rounded-md bg-muted`,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          className="aspect-square h-auto w-full rounded-md object-cover"
        />
      ) : (
        <span className="text-xl font-semibold text-muted-foreground">N/A</span>
        // <UserIcon
        //   className={`h-${iconSize} w-${iconSize} stroke-[1] text-muted-foreground`}
        // />
      )}
    </div>
  )
}

export default Avatar

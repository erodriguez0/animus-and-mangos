import { PlayIcon } from "lucide-react"

const Logo = () => {
  return (
    <div className="flex h-10 items-center gap-2">
      <PlayIcon className="aspect-square h-8 w-auto rotate-180 stroke-[4] text-primary" />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold leading-4 tracking-tighter lg:text-3xl lg:leading-[1.25rem]">
          animus
        </h1>
        <h1 className="text-2xl font-bold leading-4 tracking-tighter lg:text-3xl lg:leading-[1.25rem]">
          mangos
        </h1>
      </div>
    </div>
  )
}

export default Logo

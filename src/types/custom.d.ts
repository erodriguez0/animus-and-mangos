import { LucideIcon } from "lucide-react"

export type Routes = {
  label: string
  icon: LucideIcon
  href?: string | null | undefined
  active?: boolean | null | undefined
  links?:
    | {
        label: string
        href: string
      }[]
    | null
    | undefined
  admin?: boolean
}[]

export type State = {
  message: string
}

import { HTMLAttributes, ReactNode, forwardRef } from "react"

import { cn } from "@/lib/utils"

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children: ReactNode
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        className={cn(
          "sticky left-0 top-0 z-40 hidden h-screen w-64 shrink-0 flex-col gap-4 overflow-hidden bg-background lg:flex",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </aside>
    )
  },
)

Sidebar.displayName = "Sidebar"

export default Sidebar

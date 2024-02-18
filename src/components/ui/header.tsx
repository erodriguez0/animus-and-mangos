import { HTMLAttributes, ReactNode, forwardRef } from "react"

import { cn } from "@/lib/utils"

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        className={cn(
          "sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background px-2 text-sm lg:h-20 lg:px-4",
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className="container mx-auto flex h-full w-full items-center">
          {children}
        </div>
      </header>
    )
  },
)

Header.displayName = "Header"

export default Header

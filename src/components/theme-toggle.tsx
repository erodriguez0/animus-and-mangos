"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const ThemeToggle = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    if (theme === "dark") setTheme("light")
    else setTheme("dark")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <Button
        size="icon"
        variant="outline"
        className="shrink-0"
        aria-label="Toggle theme"
      >
        <SunIcon className="h-4 w-4" />
        <span className="sr-only">Theme</span>
      </Button>
    )

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggle}
      aria-label="Togglet theme"
      className="shrink-0"
    >
      {theme === "dark" ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Theme</span>
    </Button>
  )
}

export default ThemeToggle

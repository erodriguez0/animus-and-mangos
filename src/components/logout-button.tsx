"use client"

import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const LogoutButton = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()

  const onClick = async () => {
    await signOut()
    router.refresh()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        size="icon"
        variant="outline"
        aria-label="Logout"
      >
        <LogOutIcon className="h-4 w-4" />
        <span className="sr-only">Logout</span>
      </Button>
    )
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={onClick}
      aria-label="Logout"
    >
      <LogOutIcon className="h-4 w-4" />
      <span className="sr-only">Logout</span>
    </Button>
  )
}

export default LogoutButton

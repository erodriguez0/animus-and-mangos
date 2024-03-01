"use client"

import { AnimeList, CharacterList, MangaList } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

interface UserListsModalProps {
  mode: "anime" | "manga" | "character"
  id: string
}

const UserListsModal = ({ mode, id }: UserListsModalProps) => {
  const { data: session } = useSession()
  const [open, setOpen] = useState<boolean>(false)
  const [lists, setLists] = useState<(AnimeList | MangaList | CharacterList)[]>(
    [],
  )

  const getLists = async () => {
    try {
      const res = await fetch(
        `/api/user/${session?.user.username}/lists?mode=${mode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!res.ok) {
      }

      const data = await res.json()

      setLists(data)
    } catch (error) {}
  }

  useEffect(() => {
    if (session?.user) {
      getLists()
    }
  }, [session?.user])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full lg:w-fit">
        <div className={cn(buttonVariants(), "w-full lg:w-fit")}>
          Add To List
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
          <DialogDescription>
            Lists help you organize your favorite anime and manga
          </DialogDescription>
        </DialogHeader>

        {lists.map(list => (
          <></>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default UserListsModal

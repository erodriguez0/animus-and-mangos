"use client"

import {
  Anime,
  AnimeList,
  CharacterList,
  ListAnime,
  ListManga,
  MangaList,
} from "@prisma/client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import AddToListToggle from "@/components/ui/add-to-list-toggle"
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
  const [animeLists, setAnimeLists] = useState<
    Array<AnimeList & { anime: Array<ListAnime> }>
  >([])
  const [mangaLists, setMangaLists] = useState<
    Array<MangaList & { manga: Array<ListManga> }>
  >([])

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

      if (mode === "anime") {
        setAnimeLists(data)
      }

      if (mode === "manga") {
        setMangaLists(data)
      }
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

        <div className="flex flex-col gap-4">
          {animeLists?.map(list => {
            return (
              <div
                key={list.id}
                className="flex items-center justify-between"
              >
                <p className="text-sm font-medium">{list.name}</p>
                <AddToListToggle
                  id={id}
                  listId={list.id}
                  mode={mode}
                  exists={list?.anime?.map(a => a.anime_id).includes(id)}
                />
              </div>
            )
          })}

          {mangaLists?.map(list => {
            return (
              <div
                key={list.id}
                className="flex items-center justify-between"
              >
                <p className="text-sm font-medium">{list.name}</p>
                <AddToListToggle
                  id={id}
                  listId={list.id}
                  mode={mode}
                  exists={list?.manga?.map(m => m.manga_id).includes(id)}
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserListsModal

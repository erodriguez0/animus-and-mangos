import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import ScrollList from "@/components/ui/scroll-list"

import CreateListModal from "@/components/modals/create-list-modal"

import { getAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

import { ExtendedUser } from "@/types/custom"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const session = await getAuthSession()

  const res = await fetch(
    `${process.env.API_URL}/api/user/${params.username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  if (!res) {
    notFound()
  }

  const user: ExtendedUser = await res.json()

  return (
    <>
      {session?.user.username === params.username && (
        <div className="px-4 py-4 lg:px-0">
          <CreateListModal />
        </div>
      )}

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <h3 className="text-xl font-semibold tracking-tight">Anime</h3>
        <div className="border-t" />
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {user.anime_lists.length === 0 && (
          <p className="text-sm">No anime lists</p>
        )}

        {user.anime_lists.length > 0 &&
          user.anime_lists.map(list => (
            <div
              key={list.id}
              className="flex flex-col gap-2"
            >
              <div className="flex w-full items-center justify-between">
                <Link
                  href={`/u/${user.username}/a/${list.id}`}
                  className="text-lg font-semibold tracking-tight"
                >
                  {list.name}
                </Link>

                <Link
                  href={`/u/${user.username}/a/${list.id}`}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "link" }),
                    "text-foreground",
                  )}
                >
                  View All
                </Link>
              </div>

              {list.anime.length < 1 ? (
                <div className="text-sm text-muted-foreground">
                  Empty Anime List
                </div>
              ) : (
                <ScrollList
                  items={list.anime.map(item => item.anime)}
                  type="anime"
                  size="sm"
                  limit={10}
                />
              )}
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <h3 className="text-xl font-semibold tracking-tight">Manga</h3>
        <div className="border-t" />
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {user.manga_lists.length === 0 && (
          <p className="text-sm">No manga lists</p>
        )}

        {user.manga_lists.length > 0 &&
          user.manga_lists.map(list => (
            <div
              key={list.id}
              className="flex flex-col gap-2"
            >
              <div className="flex w-full items-center justify-between">
                <Link
                  href={`/u/${user.username}/m/${list.id}`}
                  className="text-lg font-semibold tracking-tight"
                >
                  {list.name}
                </Link>

                <Link
                  href={`/u/${user.username}/m/${list.id}`}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "link" }),
                    "text-foreground",
                  )}
                >
                  View All
                </Link>
              </div>

              {list.manga.length < 1 ? (
                <div className="text-sm text-muted-foreground">
                  Empty Manga List
                </div>
              ) : (
                <ScrollList
                  items={list.manga.map(item => item.manga)}
                  type="manga"
                />
              )}
            </div>
          ))}
      </div>
    </>
  )
}

export default UserProfilePage

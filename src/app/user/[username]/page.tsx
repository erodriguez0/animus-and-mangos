import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"

import CreateListModal from "@/components/modals/create-list-modal"

import { cn } from "@/lib/utils"

import { ExtendedUser } from "@/types/custom"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
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
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <div className="px-4 py-4 lg:px-0">
        <CreateListModal />
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <h3 className="text-2xl font-semibold tracking-tight">Anime Lists</h3>
        <div className="border-t" />
      </div>

      <div className="flex flex-col items-center justify-between px-4 lg:px-0">
        {user.anime_lists.length === 0 && (
          <p className="text-sm">No anime lists</p>
        )}

        {user.anime_lists.length > 0 &&
          user.anime_lists.map(list => (
            <div
              key={list.id}
              className="flex w-full items-center justify-between"
            >
              <Link
                href="/list"
                className="text-xl font-semibold tracking-tight"
              >
                {list.name}
              </Link>

              <Link
                href="/list/"
                className={cn(
                  buttonVariants({ size: "sm", variant: "link" }),
                  "text-foreground",
                )}
              >
                View All
              </Link>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <h3 className="text-2xl font-semibold tracking-tight">Manga Lists</h3>
        <div className="border-t" />
      </div>

      <div className="flex flex-col items-center justify-between px-4 lg:px-0">
        {user.manga_lists.length === 0 && (
          <p className="text-sm">No manga lists</p>
        )}

        {user.manga_lists.length > 0 &&
          user.manga_lists.map(list => (
            <div
              key={list.id}
              className="flex w-full items-center justify-between"
            >
              <Link
                href="/list"
                className="text-xl font-semibold tracking-tight"
              >
                {list.name}
              </Link>

              <Link
                href="/list/"
                className={cn(
                  buttonVariants({ size: "sm", variant: "link" }),
                  "text-foreground",
                )}
              >
                View All
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default UserProfilePage

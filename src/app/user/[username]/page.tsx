import Link from "next/link"
import { notFound } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"

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

      <div className="flex items-center justify-between px-4 lg:px-0">
        <h4 className="text-xl font-semibold tracking-tight">Favorites</h4>

        <Link
          href="/list/"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <h3 className="text-2xl font-semibold tracking-tight">Manga Lists</h3>
        <div className="border-t" />
      </div>

      <div className="flex items-center justify-between px-4 lg:px-0">
        {user.manga_lists.length === 0 && (
          <p className="text-sm">No manga lists</p>
        )}

        {user.manga_lists.length > 0 &&
          user.manga_lists.map(list => (
            <>
              <h4 className="text-xl font-semibold tracking-tight">
                {list.name}
              </h4>

              <Link
                href="/list/"
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                )}
              >
                View All
              </Link>
            </>
          ))}
      </div>
    </>
  )
}

export default UserProfilePage

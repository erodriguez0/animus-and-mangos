import { UserRole } from "@prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import CharacterScrollList from "@/components/ui/character-list"
import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"
import { cn } from "@/lib/utils"

interface AnimeDetailsPageProps {
  params: {
    id: string
  }
}

const AnimeDetailsPage = async ({ params }: AnimeDetailsPageProps) => {
  const session = await getAuthSession()

  const anime = await prismadb.anime.findUnique({
    where: {
      id: params.id,
    },
    include: {
      characters: {
        include: {
          character: true,
        },
      },
    },
  })

  if (!anime) {
    notFound()
  }

  return (
    <>
      <div className="flex flex-col lg:h-96 lg:flex-row lg:gap-4">
        <Poster
          src={anime.poster}
          className="mx-auto h-96 w-fit lg:h-full lg:w-auto"
        />

        <div className="flex h-full flex-1 flex-col gap-4">
          <div className="flex h-fit w-full items-center rounded-md bg-secondary p-4 text-secondary-foreground lg:h-16">
            <h2 className="text-xl font-bold tracking-tight">{anime.title}</h2>
          </div>

          <ScrollArea
            type="always"
            className="max-h-80 whitespace-pre-wrap break-all px-4 text-sm"
          >
            {anime.synopsis}
          </ScrollArea>
        </div>
      </div>

      {session && (
        <div className="flex w-full gap-4 rounded-md border-y p-4 lg:border-x">
          <Button className="w-fit">Add To List</Button>

          {session?.user.role === UserRole.ADMIN && (
            <Link
              href={`/dashboard/anime/${anime.id}`}
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Edit
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full shrink-0 lg:max-w-[265.84px]">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Format</TableCell>
                <TableCell className="flex justify-end">
                  {anime.format}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell className="flex justify-end capitalize">
                  {anime.status?.replaceAll("_", " ").toLowerCase()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell className="flex justify-end capitalize">
                  {anime.season?.toLowerCase() || ""}{" "}
                  {anime.season && anime.year ? anime.year : "--"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Episodes</TableCell>
                <TableCell className="flex justify-end">
                  {anime.episode_count || "--"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell className="flex justify-end capitalize">
                  {anime.source_type?.replaceAll("_", " ").toLowerCase() ||
                    "--"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Age Rating</TableCell>
                <TableCell className="flex justify-end">
                  {anime.age_rating?.replaceAll("_", " ") || "--"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex w-full flex-col gap-4 px-4 lg:px-0">
          <div className="w-full rounded-md">
            <h3 className="text-lg font-bold tracking-tight">Characters</h3>
          </div>

          <div className="w-full lg:max-w-[998.17px]">
            <CharacterScrollList
              characters={anime.characters.map(c => c.character)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AnimeDetailsPage

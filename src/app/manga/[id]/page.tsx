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

interface MangaDetailsPageProps {
  params: {
    id: string
  }
}

const MangaDetailsPage = async ({ params }: MangaDetailsPageProps) => {
  const session = await getAuthSession()

  const manga = await prismadb.manga.findUnique({
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

  if (!manga) {
    notFound()
  }

  return (
    <>
      <div className="flex flex-col lg:h-96 lg:flex-row">
        <Poster
          src={manga.poster}
          className="mx-auto h-96 w-fit lg:h-full lg:w-auto"
        />

        <div className="flex h-full flex-1 flex-col">
          <div className="flex h-fit w-full items-center rounded-md bg-secondary p-4 text-secondary-foreground lg:h-16">
            <h2 className="text-xl font-bold tracking-tight">{manga.title}</h2>
          </div>

          <ScrollArea
            type="always"
            className="max-h-80 whitespace-pre-wrap break-all p-4 text-sm"
          >
            {manga.synopsis}
          </ScrollArea>
        </div>
      </div>

      <div className="flex w-full gap-4 rounded-md border-y p-4 lg:border-x">
        <Button className="w-fit">Add To List</Button>
        {session?.user.role === UserRole.ADMIN && (
          <Link
            href={`/dashboard/manga/${manga.id}`}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Edit
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:max-w-[265.84px]">
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Format</TableCell>
                <TableCell className="flex justify-end capitalize">
                  {manga.format?.replaceAll("_", " ").toLowerCase()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell className="flex justify-end capitalize">
                  {manga.status?.replaceAll("_", " ").toLowerCase()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Volumes</TableCell>
                <TableCell className="flex justify-end">
                  {manga.volumes || "N/A"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Chapters</TableCell>
                <TableCell className="flex justify-end">
                  {manga.chapters || "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-0">
          <div className="w-full rounded-md">
            <h3 className="text-lg font-bold tracking-tight">Characters</h3>
          </div>

          <CharacterScrollList
            characters={manga.characters.map(c => c.character)}
          />
        </div>
      </div>
    </>
  )
}

export default MangaDetailsPage

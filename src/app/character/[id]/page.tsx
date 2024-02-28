import { UserRole } from "@prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import CharacterScrollList from "@/components/ui/character-list"
import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"
import ScrollList from "@/components/ui/scroll-list"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"

import { getAuthSession } from "@/lib/auth"
import { prismadb } from "@/lib/db"
import { cn } from "@/lib/utils"

interface CharacterDetailsPageProps {
  params: {
    id: string
  }
}

const CharacterDetailsPage = async ({ params }: CharacterDetailsPageProps) => {
  const session = await getAuthSession()

  const character = await prismadb.character.findUnique({
    where: {
      id: params.id,
    },
    include: {
      anime: {
        include: {
          anime: true,
        },
      },
      manga: {
        include: {
          manga: true,
        },
      },
    },
  })

  if (!character) {
    notFound()
  }

  return (
    <>
      <div className="flex flex-col lg:h-96 lg:flex-row lg:gap-4">
        <Poster
          src={character.image}
          className="mx-auto h-96 w-fit lg:h-full lg:w-auto"
        />

        <div className="flex h-full flex-1 flex-col gap-4">
          <div className="flex h-fit w-full items-center rounded-md bg-secondary p-4 text-secondary-foreground lg:h-16">
            <h2 className="text-xl font-bold tracking-tight">
              {character.name}
            </h2>
          </div>

          <ScrollArea
            type="always"
            className="max-h-80 whitespace-pre-wrap break-all px-4 text-sm"
          >
            {character.bio}
          </ScrollArea>
        </div>
      </div>

      <div className="flex w-full gap-4 rounded-md border-y p-4 lg:border-x">
        <Button className="w-fit">Add To List</Button>
        {session?.user.role === UserRole.ADMIN && (
          <Link
            href={`/dashboard/character/${character.id}`}
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
                <TableCell>Age</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Birthdate</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Origin</TableCell>
                <TableCell className="flex justify-end">
                  <div
                    className="line-clamp-1"
                    title="Some place"
                  >
                    --
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Race</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Weight</TableCell>
                <TableCell className="flex justify-end">--</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-0">
          <div className="w-full rounded-md">
            <h3 className="text-lg font-bold tracking-tight">Anime</h3>
          </div>

          <ScrollList
            items={character.anime.map(a => a.anime)}
            type="anime"
          />

          <div className="w-full rounded-md">
            <h3 className="text-lg font-bold tracking-tight">Manga</h3>
          </div>

          <div className="w-full lg:max-w-[998.17px]">
            <ScrollList
              items={character.manga.map(m => m.manga)}
              type="manga"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CharacterDetailsPage

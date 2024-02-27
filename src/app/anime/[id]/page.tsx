import { UserRole } from "@prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      <div className="flex flex-col lg:h-96 lg:flex-row">
        <Poster
          src={anime.poster}
          className="mx-auto h-96 w-fit lg:h-full lg:w-auto"
        />

        <div className="flex h-full flex-1 flex-col">
          <div className="h-fit w-full rounded-md bg-secondary p-4 text-secondary-foreground">
            <h2 className="text-2xl font-bold tracking-tight">{anime.title}</h2>
          </div>

          <ScrollArea
            type="always"
            className="max-h-80 whitespace-pre-wrap break-all p-4 text-sm"
          >
            {anime.synopsis}
          </ScrollArea>
        </div>
      </div>

      <div className="flex w-full gap-4 rounded-md border p-4">
        <Button className="w-fit">Add to list</Button>
        {session?.user.role === UserRole.ADMIN && (
          <Link
            href={`/dashboard/anime/${anime.id}`}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Edit
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        <Table className="w-full lg:max-w-[265.84px]">
          <TableBody>
            <TableRow>
              <TableCell>Format</TableCell>
              <TableCell className="flex justify-end">{anime.format}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Season</TableCell>
              <TableCell className="flex justify-end capitalize">
                {anime.season?.toLowerCase() || ""}{" "}
                {anime.season && anime.year ? anime.year : "N/A"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Episodes</TableCell>
              <TableCell className="flex justify-end">
                {anime.episode_count || "N/A"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell className="flex justify-end capitalize">
                {anime.source_type?.replaceAll("_", " ").toLowerCase() || "N/A"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Age Rating</TableCell>
              <TableCell className="flex justify-end">
                {anime.age_rating?.replaceAll("_", " ") || "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default AnimeDetailsPage

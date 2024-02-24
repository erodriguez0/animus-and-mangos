import BannerCarousel from "@/components/ui/banner-carousel"
import Poster from "@/components/ui/poster"
import { ScrollArea } from "@/components/ui/scroll-area"

import { prismadb } from "@/lib/db"

const HomePage = async () => {
  const latestAnime = await prismadb.anime.findMany({
    take: 20,
    orderBy: {
      created_at: "desc",
    },
  })

  const latestManga = await prismadb.manga.findMany({
    take: 20,
    orderBy: {
      created_at: "desc",
    },
  })

  const loop = () => {}

  return (
    <>
      <BannerCarousel />

      <ScrollArea
        type="always"
        orientation="horizontal"
        className="w-full grow-0 pb-4"
      >
        <div className="flex h-24 gap-2">
          {latestAnime.map(anime => (
            <Poster
              key={anime.id}
              src={anime.poster}
              iconSize={4}
              className="h-full w-auto"
            />
          ))}

          {[...Array(30)].map((v, i) => (
            <Poster
              key={i}
              src={latestAnime[0].poster}
              iconSize={4}
              className="h-full w-auto"
            />
          ))}
        </div>
      </ScrollArea>

      <ScrollArea
        type="always"
        orientation="horizontal"
        className="w-full grow-0 pb-4"
      >
        <div className="flex h-24 gap-2">
          {latestManga.map(manga => (
            <Poster
              key={manga.id}
              src={manga.poster}
              iconSize={4}
              className="h-full w-auto"
            />
          ))}

          {[...Array(30)].map((v, i) => (
            <Poster
              key={i}
              src={latestManga[0].poster}
              iconSize={4}
              className="h-full w-auto"
            />
          ))}
        </div>
      </ScrollArea>
    </>
  )
}

export default HomePage

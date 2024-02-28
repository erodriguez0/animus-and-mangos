import BannerCarousel from "@/components/ui/banner-carousel"
import ScrollList from "@/components/ui/scroll-list"

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

  return (
    <>
      <BannerCarousel />

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <div className="w-full rounded-md">
          <h3 className="text-xl font-bold tracking-tight">Latest Anime</h3>
        </div>

        <ScrollList items={latestAnime} />
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        <div className="w-full rounded-md">
          <h3 className="text-xl font-bold tracking-tight">Latest Manga</h3>
        </div>

        <ScrollList
          items={latestManga}
          type="manga"
        />
      </div>
    </>
  )
}

export default HomePage

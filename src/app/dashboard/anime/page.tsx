import List from "@/components/ui/list"
import Poster from "@/components/ui/poster"

import DashboardPageTitle from "@/components/dashboard/dashboard-page-title"

import { prismadb } from "@/lib/db"

const DashboardAnimeOverviewPage = async () => {
  const recent = await prismadb.anime.findMany({
    take: 3,
    orderBy: {
      created_at: "desc",
    },
  })

  const updated = await prismadb.anime.findMany({
    where: {
      id: {
        notIn: recent.map(item => item.id),
      },
    },
    take: 3,
    orderBy: {
      updated_at: "desc",
    },
  })

  return (
    <>
      <DashboardPageTitle title="Anime: Overview" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <List
            title="Recently Added"
            type="anime"
            items={recent}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <List
            title="Updated"
            type="anime"
            items={updated}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <List
            title="Updated"
            type="anime"
            items={updated}
          />
        </div>
      </div>
    </>
  )
}

export default DashboardAnimeOverviewPage

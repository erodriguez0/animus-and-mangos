import List from "@/components/ui/list"

import DashboardPageTitle from "@/components/dashboard/dashboard-page-title"

import { prismadb } from "@/lib/db"

const DashboardMangaOverviewPage = async () => {
  const recent = await prismadb.manga.findMany({
    take: 3,
    orderBy: {
      created_at: "desc",
    },
  })

  const updated = await prismadb.manga.findMany({
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
      <DashboardPageTitle title="Manga: Overview" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <List
            title="Recently Added"
            type="manga"
            items={recent}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <List
            title="Updated"
            type="manga"
            items={updated}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <List
            title="Updated"
            type="manga"
            items={updated}
          />
        </div>
      </div>
    </>
  )
}

export default DashboardMangaOverviewPage

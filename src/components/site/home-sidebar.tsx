// import List from "@/components/ui/list"
import Sidebar from "@/components/ui/sidebar"

import { prismadb } from "@/lib/db"

const HomeSidebar = async () => {
  const anime = await prismadb.anime.findMany({ take: 5 })

  return (
    <Sidebar className="static h-full min-h-[calc(100vh-5rem)] w-80 gap-4">
      <></>
      {/* <List
        title="Trending"
        href="/"
        type="anime"
        items={anime}
      />

      <List
        title="Upcoming"
        type="anime"
        items={anime}
      /> */}
    </Sidebar>
  )
}

export default HomeSidebar

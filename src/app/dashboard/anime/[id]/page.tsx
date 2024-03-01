import { notFound } from "next/navigation"

import AnimeForm from "@/components/forms/anime-form"

import DashboardPageTitle from "@/components/dashboard/dashboard-page-title"

import { ExtendedAnime } from "@/types/custom"

interface DashboardAnimeFormPageProps {
  params: {
    id: string
  }
}

const DashboardAnimeFormPage = async ({
  params,
}: DashboardAnimeFormPageProps) => {
  if (params.id === "add") {
    return (
      <>
        <DashboardPageTitle title="Anime: Add" />
        <AnimeForm />
      </>
    )
  }

  const res = await fetch(`${process.env.API_URL}/anime/${params.id}`, {
    method: "GET",
  })

  if (!res || !res.ok) {
    notFound()
  }

  const anime: ExtendedAnime = await res.json()

  return (
    <>
      <DashboardPageTitle title="Anime: Edit" />
      <AnimeForm anime={anime} />
    </>
  )
}

export default DashboardAnimeFormPage

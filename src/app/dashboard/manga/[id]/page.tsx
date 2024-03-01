import { notFound } from "next/navigation"

import MangaForm from "@/components/forms/manga-form"

import DashboardPageTitle from "@/components/dashboard/dashboard-page-title"

import { ExtendedManga } from "@/types/custom"

interface DashboardMangaFormPageProps {
  params: {
    id: string
  }
}

const DashboardMangaFormPage = async ({
  params,
}: DashboardMangaFormPageProps) => {
  if (params.id === "add") {
    return (
      <>
        <DashboardPageTitle title="Manga: Add" />
        <MangaForm />
      </>
    )
  }

  const res = await fetch(`${process.env.API_URL}/manga/${params.id}`, {
    method: "GET",
  })

  if (!res || !res.ok) {
    notFound()
  }

  const manga: ExtendedManga = await res.json()

  return (
    <>
      <DashboardPageTitle title="Manga: Edit" />
      <MangaForm manga={manga} />
    </>
  )
}

export default DashboardMangaFormPage

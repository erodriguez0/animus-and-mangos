import { notFound } from "next/navigation"

import CharacterForm from "@/components/forms/character-form"

import DashboardPageTitle from "@/components/dashboard/dashboard-page-title"

import { ExtendedCharacter } from "@/types/custom"

interface DashboardCharacterFormPageProps {
  params: {
    id: string
  }
}

const DashboardCharacterFormPage = async ({
  params,
}: DashboardCharacterFormPageProps) => {
  if (params.id === "add") {
    return (
      <>
        <DashboardPageTitle title="Character: Add" />
        <CharacterForm />
      </>
    )
  }

  const res = await fetch(`${process.env.API_URL}/api/character/${params.id}`, {
    method: "GET",
  })

  if (!res || !res.ok) {
    notFound()
  }

  const character: ExtendedCharacter = await res.json()

  return (
    <>
      <DashboardPageTitle title="Character: Edit" />
      <CharacterForm character={character} />
    </>
  )
}

export default DashboardCharacterFormPage

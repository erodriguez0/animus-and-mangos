import { notFound, redirect } from "next/navigation"

import { getAuthSession } from "@/lib/auth"

interface UserSettingsPageProps {
  params: {
    username: string
  }
}

const UserSettingsPage = async ({ params }: UserSettingsPageProps) => {
  const session = await getAuthSession()

  if (!session) {
    redirect("/")
  }

  if (session.user.username !== params.username) {
    redirect("/")
  }

  const user = await fetch(`${process.env.API_URL}/user/${params.username}`)

  if (!user) {
    notFound()
  }

  return <div>Settings</div>
}

export default UserSettingsPage

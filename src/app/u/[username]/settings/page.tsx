import { notFound, redirect } from "next/navigation"

import AvatarForm from "@/components/forms/avatar-form"
import PasswordForm from "@/components/forms/password-form"
import UsernameForm from "@/components/forms/username-form"

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

  return (
    <>
      <div className="px-4 lg:px-0">
        <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
      </div>

      <div className="flex flex-col gap-8">
        <AvatarForm />

        <UsernameForm user={session.user} />

        <PasswordForm />
      </div>
    </>
  )
}

export default UserSettingsPage

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"

import { UsernameSchema, UsernameType } from "@/lib/validators/username"

interface UsernameFormProps {
  user: Pick<User, "username">
}

const UsernameForm = ({ user }: UsernameFormProps) => {
  const router = useRouter()

  const form = useForm<UsernameType>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: user.username,
    },
  })

  const onSubmit = async (values: UsernameType) => {
    try {
      const res = await fetch(`/api/settings/username`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
      }

      router.replace(`/u/${form.getValues("username")}/settings`)
      router.refresh()
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4 lg:max-w-lg"
      >
        <FormInput
          name="username"
          control={form.control}
          label="Username"
          disabled={form.formState.isSubmitting}
          showError
        />

        <Button
          type="submit"
          className="lg:w-fit"
        >
          Update Username
        </Button>
      </form>
    </Form>
  )
}

export default UsernameForm

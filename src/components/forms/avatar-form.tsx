"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormImageUpload from "@/components/ui/form-image-upload"

import { AvatarSchema, AvatarType } from "@/lib/validators/avatar"

const AvatarForm = () => {
  const router = useRouter()

  const form = useForm<AvatarType>({
    resolver: zodResolver(AvatarSchema),
    defaultValues: {
      avatar: "",
    },
  })

  const onSubmit = async (values: AvatarType) => {
    try {
      const res = await fetch(`/api/settings/avatar`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
      }

      router.refresh()
      form.setValue("avatar", "")
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4 lg:max-w-lg"
      >
        <FormImageUpload
          name="avatar"
          control={form.control}
          label="Avatar"
          disabled={form.formState.isSubmitting}
          showError
          className="lg:w-fit"
        />

        <Button
          type="submit"
          className="lg:w-fit"
        >
          Update Avatar
        </Button>
      </form>
    </Form>
  )
}

export default AvatarForm

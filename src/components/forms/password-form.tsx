"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"

import { PasswordSchema, PasswordType } from "@/lib/validators/password"

const PasswordForm = () => {
  const router = useRouter()

  const form = useForm<PasswordType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
      current: "",
    },
  })

  const onSubmit = async (values: PasswordType) => {
    try {
      const res = await fetch(`/api/settings/password`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
      }

      router.refresh()
      form.reset()
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4 lg:max-w-lg"
      >
        <FormInput
          name="password"
          control={form.control}
          label="New Password"
          type="password"
          disabled={form.formState.isSubmitting}
          showError
        />

        <FormInput
          name="confirm"
          control={form.control}
          label="Confirm Password"
          type="password"
          disabled={form.formState.isSubmitting}
          showError
        />

        <FormInput
          name="current"
          control={form.control}
          label="Current Password"
          type="password"
          disabled={form.formState.isSubmitting}
          showError
        />

        <Button
          type="submit"
          className="lg:w-fit"
        >
          Update Password
        </Button>
      </form>
    </Form>
  )
}

export default PasswordForm

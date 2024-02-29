"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import FormSelect from "@/components/ui/form-select"

import { ListSchema, ListType, TypesOfLists } from "@/lib/validators/list"

import { ErrorResponse } from "@/types/custom"

interface ListFormProps {
  onClick?: () => void
}

const ListForm = ({ onClick }: ListFormProps) => {
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<ListType>({
    resolver: zodResolver(ListSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: ListType) => {
    try {
      const res = await fetch("/api/list", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const { message }: ErrorResponse = await res.json()
        setError(message)
        return
      }

      if (onClick) {
        onClick()
      }

      router.refresh()
    } catch (error) {
      setError("Something went wrong, try again later")
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {error && <ErrorBanner message={error} />}

          <FormInput
            name="name"
            control={form.control}
            label="Name"
            disabled={form.formState.isSubmitting}
          />

          <FormSelect
            name="type"
            control={form.control}
            options={TypesOfLists}
            label="Type"
            disabled={form.formState.isSubmitting}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="lg:w-fit"
          >
            Create List
          </Button>
        </form>
      </Form>
    </>
  )
}

export default ListForm

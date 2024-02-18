"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MangaFormat, MangaStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import FormSelect from "@/components/ui/form-select"
import FormTextarea from "@/components/ui/form-textarea"
import ImageUpload from "@/components/ui/image-upload"

import { MangaSchema, MangaType } from "@/lib/validators/manga"

const AddMangaForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<MangaType>({
    resolver: zodResolver(MangaSchema),
    defaultValues: {
      title: "",
      poster: "",
      format: "",
      status: "",
      volumes: "",
      chapters: "",
      synopsis: "",
      background: "",
    },
  })

  const onSubmit = async (values: MangaType) => {
    try {
      setLoading(true)
      setError("")

      const res = await fetch("/api/manga", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const message: string = await res.json()
        setError(message)
        window.scrollTo({ top: 0 })
        return
      }

      router.push("/dashboard/manga")
      router.refresh()
    } catch (error) {
      setError("Something went wrong")
      window.scrollTo({ top: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-y-8">
      {error && <ErrorBanner message={error} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-y-8"
        >
          <FormField
            name="poster"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poster</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    className="lg:w-fit"
                    aspectRatio="anime"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormInput
            name="title"
            control={form.control}
            label="Title"
            showError
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-y-8">
            <FormSelect
              name="format"
              control={form.control}
              options={MangaFormat}
              label="Format"
              showError
            />

            <FormSelect
              name="status"
              control={form.control}
              options={MangaStatus}
              label="Status"
              showError
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <FormInput
                  name="volumes"
                  control={form.control}
                  type="number"
                  label="Volumes"
                  showError
                />
              </div>

              <div className="col-span-1">
                <FormInput
                  name="chapters"
                  control={form.control}
                  type="number"
                  label="Chapters"
                  showError
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <FormTextarea
                name="synopsis"
                control={form.control}
                label="Synopsis"
                rows={8}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <FormTextarea
                name="background"
                control={form.control}
                label="Background"
                rows={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="lg:w-fit"
          >
            Create Manga
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AddMangaForm

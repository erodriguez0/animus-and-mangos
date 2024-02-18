"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  AnimeAgeRating,
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from "@prisma/client"
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

import { AnimeSchema, AnimeType } from "@/lib/validators/anime"

const AddAnimeForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<AnimeType>({
    resolver: zodResolver(AnimeSchema),
    defaultValues: {
      title: "",
      poster: "",
      format: "",
      status: "",
      source_type: "",
      season: "",
      year: "",
      age_rating: "",
      episode_count: "",
      synopsis: "",
      background: "",
    },
  })

  const onSubmit = async (values: AnimeType) => {
    try {
      setLoading(true)
      setError("")

      const res = await fetch("/api/anime", {
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

      router.push("/dashboard/anime")
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
              options={AnimeFormat}
              label="Format"
              showError
            />

            <FormSelect
              name="status"
              control={form.control}
              options={AnimeStatus}
              label="Status"
              showError
            />

            <FormSelect
              name="source_type"
              control={form.control}
              options={AnimeSource}
              label="Source Type"
              showError
            />

            <FormSelect
              name="season"
              control={form.control}
              options={AnimeSeason}
              label="Season"
              showError
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <FormInput
                  name="year"
                  control={form.control}
                  type="number"
                  label="Year"
                  showError
                />
              </div>

              <div className="col-span-1">
                <FormInput
                  name="episode_count"
                  control={form.control}
                  type="number"
                  label="Episodes"
                  showError
                />
              </div>
            </div>

            <FormSelect
              name="age_rating"
              control={form.control}
              options={AnimeAgeRating}
              label="Age Rating"
              showError
            />
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
            Create Anime
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AddAnimeForm

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  AnimeAgeRating,
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from "@prisma/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormImageUpload from "@/components/ui/form-image-upload"
import FormInput from "@/components/ui/form-input"
import FormSelect from "@/components/ui/form-select"
import FormTextarea from "@/components/ui/form-textarea"

import { AnimeSchema, AnimeType } from "@/lib/validators/anime"

import { ExtendedAnime } from "@/types/custom"

interface AnimeFormProps {
  anime?: ExtendedAnime
}

const AnimeForm = ({ anime }: AnimeFormProps) => {
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (error.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [error])

  const form = useForm<AnimeType>({
    resolver: zodResolver(AnimeSchema),
    defaultValues: {
      title: anime?.title || "",
      poster: anime?.poster || "",
      format: anime?.format || "",
      status: anime?.status || "",
      episode_count: anime?.episode_count || "",
      season: anime?.season || "",
      year: anime?.year || "",
      source_type: anime?.source_type || "",
      age_rating: anime?.age_rating || "",
      synopsis: anime?.synopsis || "",
      background: anime?.background || "",
    },
  })

  const onSubmit = async (values: AnimeType) => {
    try {
      let res: Response
      setError("")

      if (anime) {
        res = await fetch(`/api/anime/${anime.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
      } else {
        res = await fetch("/api/anime", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
      }

      if (!res.ok) {
        const message: string = await res.json()
        setError(message)
        return
      }

      // Redirect
    } catch (error) {
      setError("Something went wrong, try again later")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 md:max-w-lg"
      >
        {error && <ErrorBanner message={error} />}

        <FormImageUpload
          name="poster"
          label="Poster"
          control={form.control}
          disabled={form.formState.isSubmitting}
          showError
          className="md:w-fit"
        />

        <FormInput
          name="title"
          label="Title"
          control={form.control}
          disabled={form.formState.isSubmitting}
          showError
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2 md:col-span-1">
            <FormSelect
              name="format"
              control={form.control}
              label="Format"
              options={AnimeFormat}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FormSelect
              name="status"
              control={form.control}
              label="Status"
              options={AnimeStatus}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <FormSelect
              name="season"
              control={form.control}
              label="Season"
              options={AnimeSeason}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-6 md:col-span-3">
            <FormInput
              name="year"
              control={form.control}
              label="Year"
              type="number"
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-6 md:col-span-3">
            <FormInput
              name="episode_count"
              control={form.control}
              label="Episodes"
              type="number"
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2 md:col-span-1">
            <FormSelect
              name="source_type"
              control={form.control}
              label="Source"
              options={AnimeSource}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FormSelect
              name="age_rating"
              control={form.control}
              label="Age Rating"
              options={AnimeAgeRating}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>
        </div>

        <FormTextarea
          name="synopsis"
          label="Synopsis"
          control={form.control}
          rows={8}
          disabled={form.formState.isSubmitting}
          showError
        />

        <Button
          type="submit"
          className="md:w-fit"
        >
          {anime ? "Save Changes" : "Create Anime"}
        </Button>
      </form>
    </Form>
  )
}

export default AnimeForm

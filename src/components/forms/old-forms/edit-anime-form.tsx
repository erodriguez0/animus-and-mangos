"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Anime,
  AnimeAgeRating,
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from "@prisma/client"
import { format } from "date-fns"
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

interface EditAnimeFormProps {
  anime: Anime
}

const EditAnimeForm = ({ anime }: EditAnimeFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<AnimeType>({
    resolver: zodResolver(AnimeSchema),
    defaultValues: {
      title: anime.title,
      poster: anime.poster || "",
      format: anime.format || "",
      status: anime.status || "",
      source_type: anime.source_type || "",
      season: anime.season || "",
      year: anime.year || "",
      age_rating: anime.age_rating || "",
      episode_count: anime.episode_count || "",
      synopsis: anime.synopsis || "",
      background: anime.background || "",
    },
  })

  const onSubmit = async (values: AnimeType) => {
    try {
      setLoading(true)
      setError("")

      const res = await fetch(`/api/anime/${anime.id}`, {
        method: "PATCH",
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

  const onDelete = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/anime/${anime.id}`, {
        method: "DELETE",
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

      <div className="flex flex-col rounded-md bg-muted p-4 text-sm text-muted-foreground">
        <p>Created: {format(anime.created_at, "PP p")}</p>
        <p>Updated: {format(anime.updated_at, "PP p")}</p>
      </div>

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

          <div className="flex w-full items-center gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 md:w-fit md:flex-none"
            >
              Update Anime
            </Button>

            <Button
              type="button"
              disabled={loading}
              variant="destructive"
              onClick={onDelete}
              className="w-fit"
            >
              Delete
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditAnimeForm

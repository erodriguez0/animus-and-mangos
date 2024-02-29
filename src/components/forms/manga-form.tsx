"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Anime,
  Character,
  Manga,
  MangaFormat,
  MangaStatus,
} from "@prisma/client"
import { Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormImageUpload from "@/components/ui/form-image-upload"
import FormInput from "@/components/ui/form-input"
import FormSearch from "@/components/ui/form-search"
import FormSelect from "@/components/ui/form-select"
import FormTextarea from "@/components/ui/form-textarea"
import Poster from "@/components/ui/poster"

import { MangaSchema, MangaType } from "@/lib/validators/manga"

import { ErrorResponse, ExtendedManga, SearchMode } from "@/types/custom"

interface MangaFormProps {
  manga?: ExtendedManga
}

const MangaForm = ({ manga }: MangaFormProps) => {
  const [error, setError] = useState<string>("")
  const [characterPreview, setCharacterPreview] = useState<Character[]>(
    manga?.characters?.length
      ? manga?.characters.map(item => item.character)
      : [],
  )
  const router = useRouter()

  useEffect(() => {
    if (error.length) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [error])

  const form = useForm<MangaType>({
    resolver: zodResolver(MangaSchema),
    defaultValues: {
      title: manga?.title || "",
      poster: manga?.poster || "",
      format: manga?.format || "",
      status: manga?.status || "",
      volumes: manga?.volumes || "",
      chapters: manga?.chapters || "",
      synopsis: manga?.synopsis || "",
      background: manga?.background || "",
      characters: manga?.characters?.map(item => item.character.id) || [],
    },
  })

  const onSubmit = async (values: MangaType) => {
    try {
      let res: Response
      setError("")

      if (manga) {
        res = await fetch(`/api/manga/${manga.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
      } else {
        res = await fetch("/api/manga", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
      }

      if (!res.ok) {
        const data: ErrorResponse = await res.json()
        setError(data.message)
        return
      }

      const data: Manga = await res.json()

      router.push(`/manga/${data.id}`)
      router.refresh()
    } catch (error) {
      setError("Something went wrong, try again later")
    }
  }

  const append = (item: Anime | Manga | Character, mode: SearchMode) => {
    if (mode === "character") {
      if (!form.getValues("characters").includes(item.id)) {
        form.setValue("characters", [...form.getValues("characters"), item.id])
        setCharacterPreview([...characterPreview, item as Character])
      }
    }
  }

  const remove = (id: string, mode: SearchMode) => {
    if (mode === "character") {
      setCharacterPreview(prev => prev.filter(item => item.id !== id))

      form.setValue("characters", [
        ...form.getValues("characters").filter(item => item !== id),
      ])
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
              isOptional
              name="format"
              control={form.control}
              label="Format"
              options={MangaFormat}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FormSelect
              isOptional
              name="status"
              control={form.control}
              label="Status"
              options={MangaStatus}
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <FormInput
              name="volumes"
              control={form.control}
              label="Volumes"
              type="number"
              disabled={form.formState.isSubmitting}
              showError
            />
          </div>

          <div className="col-span-6 md:col-span-3">
            <FormInput
              name="chapters"
              control={form.control}
              label="Chapters"
              type="number"
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

        <FormSearch
          name="characters"
          control={form.control}
          label="Characters"
          mode="character"
          append={append}
          disabled={form.formState.isSubmitting}
        />

        {characterPreview.length > 0 && (
          <div className="flex flex-col gap-2">
            {characterPreview.map(character => (
              <div
                key={character.id}
                className="flex gap-2"
              >
                <div className="w-10">
                  <Poster
                    src={character.image}
                    aspect="square"
                    iconSize={4}
                  />
                </div>

                <div className="flex flex-1">
                  <p className="text-sm">{character.name}</p>
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(character.id, "character")}
                  className="h-full"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          className="md:w-fit"
        >
          {manga ? "Save Changes" : "Create Manga"}
        </Button>
      </form>
    </Form>
  )
}

export default MangaForm

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Anime, Character, Manga } from "@prisma/client"
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
import FormTextarea from "@/components/ui/form-textarea"
import Poster from "@/components/ui/poster"

import { CharacterSchema, CharacterType } from "@/lib/validators/character"

import { ErrorResponse, ExtendedCharacter, SearchMode } from "@/types/custom"

interface CharacterFormProps {
  character?: ExtendedCharacter
}

const CharacterForm = ({ character }: CharacterFormProps) => {
  const [error, setError] = useState<string>("")
  const [animePreview, setAnimePreview] = useState<Anime[]>(
    character?.anime?.length ? character?.anime.map(item => item.anime) : [],
  )
  const [mangaPreview, setMangaPreview] = useState<Manga[]>(
    character?.manga?.length ? character?.manga.map(item => item.manga) : [],
  )
  const router = useRouter()

  useEffect(() => {
    if (error.length) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [error])

  const form = useForm<CharacterType>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: {
      name: character?.name || "",
      image: character?.image || "",
      gender: character?.gender || "",
      bio: character?.bio || "",
      anime: character?.anime.length
        ? character?.anime?.map(item => item.anime.id)
        : [],
      manga: character?.manga.length
        ? character?.manga?.map(item => item.manga.id)
        : [],
    },
  })

  const onSubmit = async (values: CharacterType) => {
    try {
      let res: Response
      setError("")

      if (character) {
        res = await fetch(`/api/character/${character.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
      } else {
        res = await fetch("/api/character", {
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

      const data: Character = await res.json()

      router.push(`/character/${data.id}`)
      router.refresh()
    } catch (error) {
      setError("Something went wrong, try again later")
    }
  }

  const append = (item: Anime | Manga | Character, mode: SearchMode) => {
    if (mode !== "anime" && mode !== "manga") return

    if (!form.getValues(mode).includes(item.id)) {
      form.setValue(mode, [...form.getValues(mode), item.id])

      if (mode === "anime") {
        setAnimePreview([...animePreview, item as Anime])
      } else {
        setMangaPreview([...mangaPreview, item as Manga])
      }
    }
  }

  const remove = (id: string, mode: SearchMode) => {
    if (mode !== "anime" && mode !== "manga") return

    form.setValue(mode, [...form.getValues(mode).filter(item => item !== id)])

    if (mode === "anime") {
      setAnimePreview(prev => prev.filter(item => item.id !== id))
    } else {
      setMangaPreview(prev => prev.filter(item => item.id !== id))
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
          name="image"
          label="Image"
          control={form.control}
          disabled={form.formState.isSubmitting}
          showError
          className="md:w-fit"
        />

        <FormInput
          name="name"
          label="Name"
          control={form.control}
          disabled={form.formState.isSubmitting}
          showError
          className="w-full"
        />

        <FormTextarea
          name="bio"
          label="Bio"
          control={form.control}
          rows={8}
          disabled={form.formState.isSubmitting}
          showError
        />

        <FormSearch
          name="anime"
          control={form.control}
          label="Anime"
          mode="anime"
          append={append}
          disabled={form.formState.isSubmitting}
        />

        {animePreview.length > 0 && (
          <div className="flex flex-col gap-2">
            {animePreview.map(anime => (
              <div
                key={anime.id}
                className="flex gap-2"
              >
                <div className="w-10">
                  <Poster
                    src={anime.poster}
                    iconSize={4}
                  />
                </div>

                <div className="flex flex-1">
                  <p className="text-sm">{anime.title}</p>
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(anime.id, "anime")}
                  className="h-full"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <FormSearch
          name="manga"
          control={form.control}
          label="Manga"
          mode="manga"
          append={append}
          disabled={form.formState.isSubmitting}
        />

        {mangaPreview.length > 0 && (
          <div className="flex flex-col gap-2">
            {mangaPreview.map(manga => (
              <div
                key={manga.id}
                className="flex gap-2"
              >
                <div className="w-10">
                  <Poster
                    src={manga.poster}
                    iconSize={4}
                  />
                </div>

                <div className="flex flex-1">
                  <p className="text-sm">{manga.title}</p>
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(manga.id, "manga")}
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
          {character ? "Save Changes" : "Create Character"}
        </Button>
      </form>
    </Form>
  )
}

export default CharacterForm

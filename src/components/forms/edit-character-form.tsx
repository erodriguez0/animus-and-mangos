"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Anime, Manga } from "@prisma/client"
import { TrashIcon } from "lucide-react"
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
  FormMessage,
} from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import FormTextarea from "@/components/ui/form-textarea"
import ImageUpload from "@/components/ui/image-upload"
import { Label } from "@/components/ui/label"
import Poster from "@/components/ui/poster"
import Search from "@/components/ui/search"

import { CharacterSchema, CharacterType } from "@/lib/validators/character"

import { ExtendedCharacter } from "@/types/custom"

interface EditCharacterFormProps {
  character: ExtendedCharacter
}

const EditCharacterForm = ({ character }: EditCharacterFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [animePreview, setAnimePreview] = useState<Anime[]>(
    character.anime?.length ? character.anime.map(item => item.anime) : [],
  )
  const [mangaPreview, setMangaPreview] = useState<Manga[]>(
    character.manga?.length ? character.manga.map(item => item.manga) : [],
  )
  const router = useRouter()

  const form = useForm<CharacterType>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: {
      name: character.name,
      image: character.image || "",
      bio: character.bio || "",
      gender: character.gender || "",
      anime: character.anime?.map(item => item.anime.id) || [],
      manga: character.manga?.map(item => item.manga.id) || [],
    },
  })

  const onSubmit = async (values: CharacterType) => {
    try {
      setLoading(true)

      const res = await fetch(`/api/character/${character.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const message = await res.json()
        return setError(message)
      }

      router.push("/dashboard/character")
      router.refresh()
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const append = (item: Anime | Manga, mode: "anime" | "manga") => {
    if (!form.getValues(mode).includes(item.id)) {
      form.setValue(mode, [...form.getValues(mode), item.id])

      if (mode === "anime") {
        setAnimePreview([...animePreview, item as Anime])
      }

      if (mode === "manga") {
        setMangaPreview([...mangaPreview, item as Manga])
      }
    }
  }

  const remove = (id: string, mode: "anime" | "manga") => {
    if (mode === "anime") {
      setAnimePreview(prev => prev.filter(item => item.id !== id))
    }

    if (mode === "manga") {
      setMangaPreview(prev => prev.filter(item => item.id !== id))
    }

    form.setValue(mode, [...form.getValues(mode).filter(item => item !== id)])
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
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    className="lg:w-fit"
                    aspectRatio="square"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            name="name"
            control={form.control}
            label="Name"
            loading={loading}
            showError
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="order-2 col-span-2 flex flex-col lg:order-1 lg:col-span-1">
              <div className="flex flex-col gap-4">
                <Label>Anime</Label>
                <Search
                  onClick={append}
                  mode="anime"
                />

                <div className="flex flex-col gap-2">
                  {animePreview.map(anime => (
                    <div
                      key={anime.id}
                      className="relative flex h-20 w-full gap-2 border"
                    >
                      <Poster
                        src={anime.poster}
                        className="h-20 w-auto"
                      />
                      <div className="h-fit p-2">
                        <p className="line-clamp-3 text-sm">{anime.title}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(anime.id, "anime")}
                        className="ml-auto h-full"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 col-span-2 lg:order-2 lg:col-span-1">
              <div className="flex flex-col gap-4">
                <Label>Manga</Label>
                <Search
                  onClick={append}
                  mode="manga"
                />

                <div className="flex flex-col gap-2">
                  {mangaPreview.map(manga => (
                    <div
                      key={manga.id}
                      className="relative flex h-20 w-full gap-2 border"
                    >
                      <Poster
                        src={manga.poster}
                        className="h-20 w-auto"
                      />
                      <div className="h-fit p-2">
                        <p className="line-clamp-3 text-sm">{manga.title}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(manga.id, "manga")}
                        className="ml-auto h-full"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <FormTextarea
            name="bio"
            control={form.control}
            label="Bio"
            loading={loading}
            rows={8}
          />

          <Button
            type="submit"
            className="lg:w-fit"
          >
            Edit Character
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditCharacterForm

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"

import { AnimeSchema, AnimeType } from "@/lib/validators/anime"

import { ExtendedAnime } from "@/types/custom"

import FormInput from "../ui/form-input"

interface AnimeFormProps {
  anime?: ExtendedAnime
}

const AnimeForm = ({ anime }: AnimeFormProps) => {
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

  return (
    <Form {...form}>
      <form>
        <FormInput
          name="title"
          label="Title"
          control={form.control}
          disabled={form.formState.isSubmitting}
          showError
          className="w-full max-w-lg"
        />
      </form>
    </Form>
  )
}

export default AnimeForm

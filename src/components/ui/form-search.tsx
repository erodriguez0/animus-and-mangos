import { Anime, Character, Manga } from "@prisma/client"
import { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Search from "@/components/ui/search"

import { SearchMode } from "@/types/custom"

interface FormSearchProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T, object>
  label?: string
  mode: SearchMode
  append: (item: Anime | Manga | Character, mode: SearchMode) => void
  disabled?: boolean
  className?: string
  showError?: boolean
}

const FormSearch = <T extends FieldValues>({
  name,
  control,
  label,
  mode,
  append,
  disabled,
  className,
  showError,
}: FormSearchProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Search
              mode={mode}
              onClick={append}
              disabled={disabled}
            />
          </FormControl>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}

export default FormSearch

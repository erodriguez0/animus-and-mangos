import { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ImageUpload from "@/components/ui/image-upload"

import { cn } from "@/lib/utils"

interface FormImageUploadProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T, object>
  label?: string
  disabled?: boolean
  className?: string
  showError?: boolean
  aspect?: "square" | "anime" | "manga"
}

const FormImageUpload = <T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  className,
  showError,
  aspect = "anime",
}: FormImageUploadProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ImageUpload
              value={field.value ? [field.value] : []}
              disabled={disabled}
              onChange={url => field.onChange(url)}
              onRemove={() => field.onChange("")}
              className={cn(className)}
              aspectRatio={aspect}
            />
          </FormControl>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}

export default FormImageUpload

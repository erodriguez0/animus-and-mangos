import { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T, object>
  label?: string
  rows?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  showError?: boolean
}

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  rows = 4,
  placeholder,
  disabled = false,
  className,
  showError = false,
}: FormTextareaProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
              {...field}
            />
          </FormControl>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}

export default FormTextarea

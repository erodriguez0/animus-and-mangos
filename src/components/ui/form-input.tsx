import { HTMLInputTypeAttribute } from "react"
import { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormInputProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T, object>
  label?: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  loading?: boolean
  className?: string
  showError?: boolean
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  loading = false,
  className,
  showError = false,
}: FormInputProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              disabled={loading}
              placeholder={placeholder}
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

export default FormInput

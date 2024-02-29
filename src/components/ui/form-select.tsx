import { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T, object>
  label?: string
  options: object
  placeholder?: string
  disabled?: boolean
  className?: string
  showError?: boolean
  isOptional?: boolean
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  disabled = false,
  className,
  showError = false,
  isOptional,
}: FormSelectProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={val => field.onChange(val === "-" ? "" : val)}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                disabled={disabled}
                className={className}
                {...field}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {isOptional && (
                <SelectItem value="-">{placeholder || "\u00a0"}</SelectItem>
              )}

              {Object.entries(options).map(item => (
                <SelectItem
                  key={item[1]}
                  value={item[0]}
                >
                  {item[1].replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}

export default FormSelect

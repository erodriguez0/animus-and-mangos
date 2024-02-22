"use client"

import { ImagePlus, TrashIcon, UploadIcon } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
  className?: string
  aspectRatio?: "square" | "anime" | "manga"
  variant?:
    | "secondary"
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  className,
  aspectRatio,
  variant = "outline",
}: ImageUploadProps) => {
  const imageAspectRatio = {
    square: "aspect-square",
    video: "aspect-video",
    anime: "aspect-anime",
    manga: "aspect-manga",
  }

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  return (
    <div className="flex flex-col gap-4">
      {value[0] && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "relative aspect-[225/325] h-auto w-48 overflow-hidden rounded-md",
              aspectRatio && imageAspectRatio[aspectRatio],
            )}
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onRemove(value[0])}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={value[0]}
              alt=""
              fill
              className="rounded-md object-cover"
            />
          </div>
        </div>
      )}

      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="bxmolsjv"
      >
        {({ open }) => {
          const onClick = () => open()

          return (
            <Button
              disabled={disabled}
              type="button"
              variant={variant}
              onClick={onClick}
              className={cn(className)}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload

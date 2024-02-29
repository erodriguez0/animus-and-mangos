"use client"

import { useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import ListForm from "@/components/forms/list-form"

import { cn } from "@/lib/utils"

const CreateListModal = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full lg:w-fit">
        <div className={cn(buttonVariants(), "w-full lg:w-fit")}>
          Create A List
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create List</DialogTitle>
          <DialogDescription>
            Lists help you organize your favorite anime and manga
          </DialogDescription>
        </DialogHeader>

        <ListForm onClick={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default CreateListModal

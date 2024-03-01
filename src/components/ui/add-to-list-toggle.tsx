"use client"

import { Button } from "@/components/ui/button"

interface AddToListToggleProps {
  id: string
  type: "anime" | "manga" | "character"
}

const AddToListToggle = ({ id, type }: AddToListToggleProps) => {
  const handleClick = async () => {}

  return <Button>Enter</Button>
}

export default AddToListToggle
